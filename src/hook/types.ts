export interface HookRequestBody {
  action: string;
  workflow_run: {
    name: string;
    path: string;
    status: string;
    conclusion: string;
  };
}
