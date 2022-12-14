---
layout: ../../layouts/BlogLayout.astro
title: Adding CodeMirror 6 to a React Project
description: Render your first CodeMirror 6 editor in React and take it from a basic setup to something more complex, functional and impressive.
published: 12/01/2022
---

CodeMirror 6 is now a thing! It has been completely rewritten from the bottom up with some improvements. These include: better accessibility, separating functionality into modules and some big performance benefits. An exciting step forward for CodeMirror and, as my go-to text editor package, I felt obliged to give it a whirl. So you are aware, all of the docs are written with vanilla js in mind however, with some slight changes, we can get it up and running for React, which will be the focus of this post.

I'm not going to talk you through setting up the whole dev environment but, I'd recommend running `npm init vite@latest` in your terminal for a quick [Vite](https://vitejs.dev/) project.

## Setting up our Editor component.

First of all let's create the base of our `Editor` component:

```js
import React, { useRef } from 'react'

export const Editor = () => {
  const editor = useRef()
  return <div ref={editor}></div>
}
```

Here we are rendering a div element and creating a reference to it via `useRef`. This is so we can attach CodeMirror to it later on. For more info on `useRef`, visit the [React docs](https://reactjs.org/docs/hooks-reference.html#useref).

## Adding CodeMirror

Next, we need to install all of the packages we will need for the basic CodeMirror setup.

```bash
npm i @codemirror/state @codemirror/view @codemirror/commands
```

Notice how everything is split into different modules now. This is one of the big changes in Codemirror 6. Once they have installed, we can import them into our Editor component.

```js
import React, { useRef } from 'react'

import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

export const Editor = () => {
  const editor = useRef()
  return <div ref={editor}></div>
}
```

We can then initialise CodeMirror and render the text editor in the browser.

```js
import React, { useRef, useEffect } from 'react'

import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

export const Editor = () => {
  const editor = useRef()

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [keymap.of(defaultKeymap)],
    })

    const view = new EditorView({ state: startState, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editor}></div>
}
```

We are using `useEffect` to initialise CodeMirror once the Editor component has mounted. Notice the `[]` as useEffects second parameter? This means the "effect" will only run once and not on every re-render. Then, within useEffect, we set up our CodeMirror instance. First, we create our initial state, this includes our text/code and any extensions we want to use (there are some other bits we can add in here too, which I'll show a little later on). Next, we create our `view` which takes in our initial state and defines the parent. The parent property accepts an element, therefore, we can use the element reference we created earlier in our Editor setup.

## Rendering it all

Now rendering it all is as simple as importing the component and using it within your `App` (or wherever else you want to use it).

```js
import React from 'react'
import './App.css'
import { Editor } from './components/Editor'

function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  )
}

export default App
```

That's all you need for a super simple setup, which is great if you want the bare (and I mean bare) minimum. If you play around with the editor though you will notice that presumed functionality such as tabbing, auto-closing brackets and line numbers are missing.

## Extending the Basics

Moving on from our super simple setup we can add some more functionality by adding `@codemirror/basic-setup`. The package is an extension that pulls together a lot of the extensions you expect in a basic editor. To see what extensions the basic setup is using you can check out [this section](https://codemirror.net/6/docs/ref/#basic-setup) on the reference page. This is what it looks like:

```js
import React, { useRef, useEffect } from 'react'

import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

export const Editor = () => {
  const editor = useRef()

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [basicSetup, keymap.of([defaultKeymap])],
    })

    const view = new EditorView({ state: startState, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editor}></div>
}
```

We have removed our `@codemirror/state` import because it's included in the basic setup and included it in our extensions. Playing around with the editor now should feel a little more familiar in terms of functionality and aesthetics. But still, tabbing seems to be missing... you might be thinking "what's the deal? It should be included" but this isn't an oversight and is explained in the [tab handling example](https://codemirror.net/6/examples/tab/). Personally, I use the tab to indent, so here's how we can add that functionality.

## Adding Tab Functionality

Even though tab indention isn't added as default we can add the command by importing the `indentWithTab` module and adding it to our keymap.

```js
import React, { useRef, useEffect } from 'react'

import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'

export const Editor = () => {
  const editor = useRef()

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [basicSetup, keymap.of([defaultKeymap, indentWithTab])],
    })

    const view = new EditorView({ state: startState, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editor}></div>
}
```

Try it out in your editor and it should work a dream. For all of the possible commands, you can add check out the [command repo's README](https://github.com/codemirror/commands/tree/main/src).

## Adding a Theme

Codemirror has made this easy for us, we can import a theme and add it as an extension when setting up the `EditorState`. Let's install the `one-dark` theme, it's my favourite one to use and the one I currently use in VS Code.

```bash
npm i @codemirror/theme-one-dark
```

and then we can import the theme and add it to the array of extensions.

```js
import React, { useRef, useEffect } from 'react'

import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export const Editor = () => {
  const editor = useRef()

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
      ],
    })

    const view = new EditorView({ state: startState, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editor}></div>
}
```

And that's it! Your theme has now been added. At present, there only seems to be the `one-dark` theme on NPM, but check out the [Themes](https://codemirror.net/6/examples/styling/#themes) section in the docs for how you can create your own or use `one-dark` as a base.

## Adding Syntax Highlighting

You might be wondering after adding the theme why your code/text isn't highlighted. The answer is we haven't told CodeMirror what language we are writing so it can't add the relevant class names to the text editor code. To start seeing some highlighting let's install the javascript language package:

```bash
npm i @codemirror/lang-javascript
```

and then we can import and add it to our extensions:

```js
import React, { useRef, useEffect } from 'react'

import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export const Editor = () => {
  const editor = useRef()

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
        javascript(),
      ],
    })

    const view = new EditorView({ state: startState, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editor}></div>
}
```

## Managing State

Being a React application at some point we will want to hold the code we write in state use elsewhere or manipulate in some shape or form. So how do we create our state from our existing setup? Here's how I did it:

```js
import React, { useRef, useEffect, useState } from 'react'

import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export const Editor = ({ setEditorState }) => {
  const editor = useRef()
  const [code, setCode] = useState('')

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString())
  })

  useEffect(() => {
    const state = EditorState.create({
      doc: 'Hello World',
      extensions: [
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
        javascript(),
        onUpdate,
      ],
    })

    const view = new EditorView({ state, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editor}></div>
}
```

Since we want to manage the state of the editor we need to import `useState` and create our state `const [code, setCode] = useState("")`. We can then tackle how we grab the code from CodeMirror and update our state. There seemed to be a few different methods out there, like this [CodeSandbox](https://codesandbox.io/s/react-17-codemirror-6-eqh06) or Cenguidano's [gist](https://www.notion.so/58efcf54c5539101d9a47345d6cea35d). I did try Cenguidano's approach originally but it didn't work out and caused an error. After playing around a little and understanding the docs more I realised that we can assign `EditorView.updateListener` directly rather than creating a function to call it. This means we can treat it as another extension and add it into the extensions array. So now our editor listens for any changes and passes the view object to a callback function. We can then `setCode(v.state.doc.toString())` in that callback to update our editor state with the current editor content.

## Conclusion

Presently there isn't a lot of content out there on getting CodeMirror 6 set up with React so I hope this article helps. If you come across some other helpful articles send them over in the form below and I will add them to a useful links section.

Additionally, I know I haven't covered updating the editor from manipulated state but that's because I haven't done it myself yet. Once I've done it and I'm happy with the process I will update the post.
