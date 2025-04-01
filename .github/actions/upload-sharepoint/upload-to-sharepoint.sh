#!/bin/bash
set -e  # Exit on error

# Read inputs - validation is in the main workflow
SOURCE_DIR="$1"
SHAREPOINT_SITE_URL="$2"
SHAREPOINT_TENANT_ID="$3"
SHAREPOINT_CLIENT_ID="$4"
SHAREPOINT_CLIENT_SECRET="$5"
CALLBACKS="$6"
CONTEXT="$7"

echo "Uploading from: $SOURCE_DIR"
echo "Uploading to: $SHAREPOINT_SITE_URL"
sudo apt-get install jq

# Authenticate to SharePoint
if ! command -v m365 &> /dev/null; then
  echo "Installing m365 CLI..."
  npm install -g @pnp/cli-microsoft365
fi

# Check if install failed and return.
if ! command -v m365 &> /dev/null; then
  echo "Failed to install m365."
  # Create an error result
  JSON_OUTPUT=$(jq -n \
    --arg success "0" \
    --arg failed "1" \
    --arg message "Error: M365 was not installed." \
    --argjson failed_files "N/A" \
    '{success_count: 0, failed_count: 1, failed_files: N/A}')
  echo "result=$JSON_OUTPUT" >> "$GITHUB_OUTPUT"
  exit 1
fi

echo "Setting up m365 CLI..."
m365 --version 2>&1 | head -n 1

m365 setup --scripting
m365 cli config set --key helpMode --value "full"
m365 cli config set --key clientId --value $SHAREPOINT_CLIENT_ID
m365 cli config set --key tenantId --value $SHAREPOINT_TENANT_ID
m365 cli config set --key authType --value secret
echo "m365 is setup up.  Now authenticating..."

#m365 status -o json 2>&1
#m365 status -o json 2>&1 | jq -e '.connectionName' > /dev/null 2>&1
#m365_status=$?
#m365_status=1

#echo "m365 status checked.  Status: $m365_status"
#if [ "$m365_status" -gt 0 ]; then
echo "Authenticating with SharePoint"
if ! m365 login --secret $SHAREPOINT_CLIENT_SECRET; then
  echo "Failed to authenticate with SharePoint"
  # Create an error result
  JSON_OUTPUT=$(jq -n \
    --arg success "0" \
    --arg failed "1" \
    --arg message "Error: Failed to authenticate with SharePoint" \
    --argjson failed_files "N/A" \
    '{success_count: 0, failed_count: 1, failed_files: N/A}')
  echo "result=$JSON_OUTPUT" >> "$GITHUB_OUTPUT"
  exit 1
else
  echo "✅ Successfully authenticated"
fi
#else
#  echo "Already authenticated with SharePoint"
#fi

# Track uploads
SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_FILES=()

# Function to upload files while preserving structure
upload_files() {
  local local_dir="$1"
  local sp_folder="$2"

  # Find and loop through all files and directories
  find "$local_dir" -type f -o -type d | while read -r item; do
    echo "Processing item: $item"
    echo "Local directory: $local_dir"
    relative_path="${item#"$local_dir"/}"
    echo "Relative path: $relative_path"
    sp_item_path="$sp_folder/$relative_path"

    echo "Next found is: $item (local_dir: $local_dir, sp_folder: $sp_folder, relative_path: $relative_path, sp_item_path: $sp_item_path)"

    if [ -d "$item" ]; then
      # Create directory in SharePoint
      echo "Creating directory: $sp_item_path"
      m365 spo folder add --webUrl "$SHAREPOINT_SITE_URL" --parentFolder "$sp_folder" --name "$relative_path"
    else
      echo "Uploading file: $sp_item_path"
      # Ensure the parent directory exists in SharePoint
      parent_dir=$(dirname "$relative_path")
      m365 spo folder add --webUrl "$SHAREPOINT_SITE_URL" --parentFolder "$sp_folder" --name "$parent_dir"

      # Upload file to SharePoint
      if m365 spo file add --webUrl "$SHAREPOINT_SITE_URL" --folder "$sp_folder/$parent_dir" --path "$item" --overwrite; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      else
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_FILES+=("$relative_path")
      fi
    fi
  done
}

# Start upload process
upload_files "$SOURCE_DIR" "/"

echo "Files that failed to upload: $FAILED_FILES[@]"
echo "Files that uploaded: $SUCCESS_COUNT"

# Create JSON output
JSON_OUTPUT=$(jq -n \
  --arg success "$SUCCESS_COUNT" \
  --arg failed "$FAILED_COUNT" \
  --arg message "Upload ran until completion." \
  --argjson failed_files "$(printf '%s\n' "$FAILED_FILES[@]" | jq -R . | jq -s .)" \
  '{success_count: $success, failed_count: $failed, failed_files: $failed_files}')

# Output JSON result for GitHub Actions
echo "result=$JSON_OUTPUT" >> "$GITHUB_OUTPUT"
