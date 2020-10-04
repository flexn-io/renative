---
id: guide-templates
title: Templates
sidebar_label: Templates
---

<img src="https://renative.org/img/ic_templates.png" width=50 height=50 />

## Templates / Starters

Templates are used as initial bootstrap structure you can use instead of creating your project source, configs and assets from scratch.

Templates are offered during creation of new project ( `rnv new` )


### Built-in

Hello World:

https://www.npmjs.com/package/renative-template-hello-world

Blank:

https://www.npmjs.com/package/renative-template-blank

### Community

Chat App:

https://www.npmjs.com/package/@reactseals/renative-template-chat

### Custom

During `rnv new` you will be give an option to choose between existing built-in templates or option to type your custom one.

You can type name of any package with has support for RNV template. (contains `renative.template.json` file at its root)

ie:

`renative-template-hello-world`

or

`@reactseals/renative-template-chat`

and so on


## CLI Support

You can manage your templates in your project via rnv command line.


`rnv template list` - list available and installed templated in your project

`rnv template add` - add template to your project

`rnv template apply` - apply one of the installed templates to your project

---

for full CLI reference, visit [Engine Core API Reference](api-cli-engine-core.md#template-add)
