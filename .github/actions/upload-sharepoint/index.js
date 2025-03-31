/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import core from '@actions/core';

export async function run() {
  try {
    const callbacks = core.getInput('aemy_callbacks');
    const aemyContext = core.getInput('aemy_context');
    const uploadSource = core.getInput('upload_source');
    const uploadTarget = core.getInput('upload_target');

    const response = {
      status: 'success',
      message: `Received callbacks: ${!!callbacks}, context: ${!!aemyContext}, source: ${uploadSource}, target: ${uploadTarget}`,
      filesUploaded: 12,
    };

    core.setOutput('result', JSON.stringify(response));
  } catch (error) {
    const errorResult = {
      status: 'failure',
      message: `Failed to upload files: ${error.message}`,
    };
    core.setOutput('result', JSON.stringify(errorResult));
    core.setFailed(error);
  }
}

run();
