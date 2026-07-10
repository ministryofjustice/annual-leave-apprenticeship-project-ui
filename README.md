# annual-leave-apprenticeship-project-ui

The frontend UI for the Annual Leave Apprenticeship Project, built with Node.js, Express, Nunjucks, and the HMPPS Forge framework.

## Prerequisites

- Node.js v24
- Docker & Docker Compose

## Getting started

### Running the app for development

1. In the [annual-leave-apprenticeship-project-api](https://github.com/ministryofjustice/annual-leave-apprenticeship-project-api) project, start the API and Postgres:

```bash
docker compose up
```

2. In this project, build the development Docker image (first time or after dependency changes):

```bash
make dev-build
```

3. Start the UI development container:

```bash
make dev-up
```

## Testing

### Unit tests

```bash
make test
```

### End-to-end tests (Playwright)

Run locally against a running dev environment:

```bash
make e2e
```

Run with Playwright UI mode:

```bash
make e2e-ui
```

Run in Docker (CI):

```bash
make e2e-ci
```

## Change log

A changelog for the upstream template is available [here](./CHANGELOG.md).
