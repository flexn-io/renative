---
id: config-private
title: Private Configs
sidebar_label: Private Configs
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview


`renative.private.json` is special type because it is meant to store sensitive information.

It's never included in git repository directly.

It typically resides in your workspace directory and gets encrypted by `rnv crypto` as a means of secure sharing between developers


this allows you to inject sensitive information (deployment keys, keystores, certificates passwords etc) into your project without compromising its security
