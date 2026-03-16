import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface SyncRule {
  pattern: string;
  owner: 'hub' | 'spoke' | 'merge';
}

export interface SyncRules {
  rules: SyncRule[];
  defaultOwner: 'hub' | 'spoke';
}

export class ConflictResolver {
  private rules: SyncRules;

  constructor(rulesPath: string = 'sync-rules.json') {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), rulesPath),
      'utf8'
    );
    this.rules = JSON.parse(content);
  }

  /**
   * Attempts to resolve merge conflicts in the given directory.
   */
  public async resolve(workingDir: string): Promise<void> {
    console.log(
      `[Conflict] Attempting to resolve conflicts in ${workingDir}...`
    );

    try {
      const statusOutput = execSync('git status --porcelain', {
        cwd: workingDir,
        encoding: 'utf8',
      });
      const unmergedFiles = statusOutput
        .split('\n')
        .filter((line) => line.startsWith('UU') || line.startsWith('AA'))
        .map((line) => line.substring(3));

      if (unmergedFiles.length === 0) {
        console.log('[Conflict] No unmerged files found.');
        return;
      }

      for (const file of unmergedFiles) {
        await this.resolveFile(workingDir, file);
      }

      console.log('[Conflict] All resolvable conflicts addressed.');
    } catch (error: any) {
      console.error(`[Conflict] Resolution failed: ${error.message}`);
      throw error;
    }
  }

  private async resolveFile(workingDir: string, file: string): Promise<void> {
    const owner = this.getFileOwner(file);
    console.log(`[Conflict] Resolving ${file} (Owner: ${owner})`);

    try {
      if (owner === 'hub') {
        // Hub wins: Use 'theirs' version (since we are pulling Hub into Spoke)
        execSync(`git checkout --theirs -- ${file}`, { cwd: workingDir });
      } else if (owner === 'spoke') {
        // Spoke wins: Use 'ours' version
        execSync(`git checkout --ours -- ${file}`, { cwd: workingDir });
      } else {
        // 'merge' or unknown: Manual required (or more complex logic)
        console.warn(`[Conflict] File ${file} requires manual merging.`);
        return;
      }

      execSync(`git add ${file}`, { cwd: workingDir });
      console.log(`[Conflict] Resolved ${file}`);
    } catch (e: any) {
      console.error(`[Conflict] Error resolving ${file}: ${e.message}`);
    }
  }

  private getFileOwner(file: string): string {
    for (const rule of this.rules.rules) {
      const regex = new RegExp('^' + rule.pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(file)) {
        return rule.owner;
      }
    }
    return this.rules.defaultOwner;
  }
}
