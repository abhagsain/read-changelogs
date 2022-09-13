export type FormData = { name: string; from: string; to: string };

export interface Release {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: Author;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: any[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  html: string;
}

export interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface ReleaseVersion {
  name: string;
  zipballURL: string;
  tarballURL: string;
  commit: Commit;
  nodeID: string;
}

export interface Commit {
  sha: string;
  url: string;
}

// types for npm.io response

export interface NPMResponse {
  analyzedAt: Date;
  collected: Collected;
  evaluation: Evaluation;
  score: Score;
}

export interface Collected {
  metadata: Metadata;
  npm: Npm;
  github: Github;
  source: Source;
}

export interface Github {
  homepage: string;
  starsCount: number;
  forksCount: number;
  subscribersCount: number;
  issues: Issues;
  contributors: Contributor[];
  commits: Commit[];
}

export interface Commit {
  from: Date;
  to: Date;
  count: number;
}

export interface Contributor {
  username: string;
  commitsCount: number;
}

export interface Issues {
  count: number;
  openCount: number;
  distribution: { [key: string]: number };
  isDisabled: boolean;
}

export interface Metadata {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: Date;
  author: Author;
  publisher: Publisher;
  maintainers: Publisher[];
  repository: Repository;
  links: Links;
  license: string;
  dependencies: Dependencies;
  devDependencies: { [key: string]: string };
  peerDependencies: PeerDependencies;
  releases: Commit[];
  hasTestScript: boolean;
  hasSelectiveFiles: boolean;
  readme: string;
}

export interface Author {
  name: string;
  email: string;
  url: string;
}

export interface Dependencies {
  "@babel/runtime": string;
  "@types/hoist-non-react-statics": string;
  "@types/use-sync-external-store": string;
  "hoist-non-react-statics": string;
  "react-is": string;
  "use-sync-external-store": string;
}

export interface Links {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

export interface Publisher {
  username: string;
  email: string;
}

export interface PeerDependencies {
  "@types/react": string;
  "@types/react-dom": string;
  react: string;
  "react-dom": string;
  "react-native": string;
  redux: string;
}

export interface Repository {
  type: string;
  url: string;
}

export interface Npm {
  downloads: Commit[];
  starsCount: number;
}

export interface Source {
  files: Files;
  badges: Badge[];
  linters: string[];
  coverage: number;
}

export interface Badge {
  urls: Urls;
  info: Info;
}

export interface Info {
  service: string;
  type: string;
  modifiers: Modifiers;
}

export interface Modifiers {
  type: string;
}

export interface Urls {
  original: string;
  shields: string;
  content: string;
}

export interface Files {
  readmeSize: number;
  testsSize: number;
  hasChangelog: boolean;
}

export interface Evaluation {
  quality: Quality;
  popularity: Popularity;
  maintenance: Maintenance;
}

export interface Maintenance {
  releasesFrequency: number;
  commitsFrequency: number;
  openIssues: number;
  issuesDistribution: number;
}

export interface Popularity {
  communityInterest: number;
  downloadsCount: number;
  downloadsAcceleration: number;
  dependentsCount: number;
}

export interface Quality {
  carefulness: number;
  tests: number;
  health: number;
  branding: number;
}

export interface Score {
  final: number;
  detail: Detail;
}

export interface Detail {
  quality: number;
  popularity: number;
  maintenance: number;
}
