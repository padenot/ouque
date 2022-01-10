# `ouque`

Execute a command on a github webhook event

# Configuration

- Configure GitHub to ping particular locations called `/app1`, `/app2`, etc.
- Write a config file called `config.json` that has the following structure:

```json
{
  "/app1": {
    "secret": "xxxxxxxxxxx",
    "script": "script_to_run_for_app1.sh"
  },
  "/app2": {
    "secret": "yyyyyyyyyyy",
    "script": "script_to_run_for_app2.sh"
  }
}

```

# License

MIT
