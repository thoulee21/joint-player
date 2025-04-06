export interface Main {
  name: string;
  zipball_url: string;
  tarball_url: string;
  commit: Commit;
  node_id: string;
}

export interface Commit {
  sha: string;
  url: string;
}
