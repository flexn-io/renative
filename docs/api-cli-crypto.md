---
id: api-cli-crypto
title: rnv crypto
sidebar_label: crypto
---

<img src="https://renative.org/img/ic_cli.png" width=50 height=50 />

> Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information

## Task Order

🔥 `crypto` ✅

## crypto

Get interactive options for crypto

```bash
rnv crypto
```

### help

Display crypto help

```bash
rnv crypto help
```

### encrypt

Encrypt sensitive project files from WORKSPACE/[PROJECT_NAME] to current project

```bash
rnv crypto encrypt
```

### decrypt

Decrypt sensitive project files from current project to WORKSPACE/[PROJECT_NAME]

```bash
rnv crypto decrypt
```

### installCerts

Install decrypted provisioning profiles from WORKSPACE/[PROJECT_NAME] to local registry

```bash
rnv crypto installCerts
```

### updateProfile

```bash
rnv crypto updateProfile
```

### updateProfiles

```bash
rnv crypto updateProfiles
```

### installProfiles

```bash
rnv crypto installProfiles
```
