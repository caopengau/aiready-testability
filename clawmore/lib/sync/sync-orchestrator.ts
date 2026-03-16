import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface SyncOptions {
  workingDir: string; // The local path of the Spoke repo being managed
  hubUrl: string; // The URL/path of the Mother repo (serverlessclaw)
  spokeBranch: string;
  hubBranch: string;
  prefix: string; // The prefix in the Spoke repo for the Hub content
  squash?: boolean;
}

export class SyncOrchestrator {
  private rulesFile: string;

  constructor(rulesPath: string = 'sync-rules.json') {
    this.rulesFile = path.resolve(process.cwd(), rulesPath);
  }

  /**
   * Syncs updates from the Mother Repo (Hub) to a Client Spoke.
   */
  public async syncHubToSpoke(options: SyncOptions): Promise<void> {
    const {
      workingDir,
      hubUrl,
      hubBranch,
      spokeBranch,
      prefix,
      squash = true,
    } = options;
    const hubRemote = 'hub-origin';

    console.log(`[Sync] Syncing Hub (${hubUrl}) to Spoke at ${workingDir}...`);

    try {
      // 1. Ensure Hub is a remote in the Spoke working directory
      this.ensureRemote(workingDir, hubRemote, hubUrl);

      // 2. Fetch latest from Hub
      this.runCommand(workingDir, `git fetch ${hubRemote} ${hubBranch}`);

      // 3. Perform subtree pull from Hub into Spoke
      const squashFlag = squash ? '--squash' : '';
      const command = `git subtree pull --prefix=${prefix} ${hubRemote} ${hubBranch} ${squashFlag} -m "chore: sync from hub ${hubBranch}"`;
      this.runCommand(workingDir, command);

      console.log(`[Sync] Successfully synced Hub into Spoke.`);
    } catch (error: any) {
      if (error.message.includes('Merge conflict')) {
        console.warn(
          `[Sync] Merge conflicts detected. Manual or Agentic resolution required.`
        );
      }
      throw error;
    }
  }

  /**
   * Pushes specific Spoke innovations back to the Mother Repo (Hub).
   * Note: This usually requires a subtree split first if the Spoke is modified.
   */
  public async pushSpokeToHub(options: SyncOptions): Promise<void> {
    const { workingDir, hubUrl, hubBranch, prefix } = options;
    const hubRemote = 'hub-origin';

    console.log(`[Sync] Pushing Spoke innovations back to Hub (${hubUrl})...`);

    try {
      this.ensureRemote(workingDir, hubRemote, hubUrl);
      const command = `git subtree push --prefix=${prefix} ${hubRemote} ${hubBranch}`;
      this.runCommand(workingDir, command);
      console.log(`[Sync] Successfully pushed back to Hub.`);
    } catch (error: any) {
      console.error(`[Sync] Push to Hub failed: ${error.message}`);
      throw error;
    }
  }

  private ensureRemote(cwd: string, name: string, url: string): void {
    try {
      this.runCommand(cwd, `git remote add ${name} ${url}`);
    } catch (e) {
      this.runCommand(cwd, `git remote set-url ${name} ${url}`);
    }
  }

  private runCommand(cwd: string, command: string): string {
    return execSync(command, { cwd, encoding: 'utf8', stdio: 'pipe' });
  }
}
