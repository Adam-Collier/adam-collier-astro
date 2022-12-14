---
layout: ../../layouts/BlogLayout.astro
title: Replacing Emojis with HTML Entities
description: Avoid issues using Emoji's in our markup by replacing them with the HTML entity equivalent. Let's write a script to help us do this.
published: 20/06/2019
---

This week I came across a case where using an emoji in my code broke a page I was working on (I suspected the emoji was causing an error in the database which stopped the rest of the page from rendering). Therefore I wanted to share a way that you can replace any emoji in a string with the HTML entity equivalent which works flawlessly. This post is only going to be a short one since I don't want to deep dive into Unicode and the pros and cons of such a format but make rather give you a solution can use in such a situation.

Lets jump in...

```js
let emojiUnicode = (input) => {
  return emojiUnicode.raw(input).toString('16')
}

emojiUnicode.raw = function (input) {
  if (input.length === 1) {
    return input.charCodeAt(0)
  }
  let comp =
    (input.charCodeAt(0) - 0xd800) * 0x400 +
    (input.charCodeAt(1) - 0xdc00) +
    0x10000
  if (comp < 0) {
    return input.charCodeAt(0)
  }
  return comp
}
```

So above is a function to convert any emoji passed in as an argument to a Unicode string, taken from the emoji-unicode npm package (thanks to [ionicabizau](https://www.npmjs.com/~ionicabizau) for creating the package)

But now we need to find a way to grab all of the emojis in a string, pass them into the function and replace each emoji with the HTML entity.

```js
export const convertEmojis = (string) => {
  var regex =
    /(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\u0023-\\u0039]\\ufe0f?\\u20e3|\\u3299|\\u3297|\\u303d|\\u3030|\\u24c2|\\ud83c[\\udd70-\\udd71]|\\ud83c[\\udd7e-\\udd7f]|\\ud83c\\udd8e|\\ud83c[\\udd91-\\udd9a]|\\ud83c[\\udde6-\\uddff]|[\\ud83c[\\ude01\\uddff]|\\ud83c[\\ude01-\\ude02]|\\ud83c\\ude1a|\\ud83c\\ude2f|[\\ud83c[\\ude32\\ude02]|\\ud83c\\ude1a|\\ud83c\\ude2f|\\ud83c[\\ude32-\\ude3a]|[\\ud83c[\\ude50\\ude3a]|\\ud83c[\\ude50-\\ude51]|\\u203c|\\u2049|[\\u25aa-\\u25ab]|\\u25b6|\\u25c0|[\\u25fb-\\u25fe]|\\u00a9|\\u00ae|\\u2122|\\u2139|\\ud83c\\udc04|[\\u2600-\\u26FF]|\\u2b05|\\u2b06|\\u2b07|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u231a|\\u231b|\\u2328|\\u23cf|[\\u23e9-\\u23f3]|[\\u23f8-\\u23fa]|\\ud83c\\udccf|\\u2934|\\u2935|[\\u2190-\\u21ff])/g
  let emojis = string.match(regex)

  if (emojis) {
    let convertedEmojis = emojis.map((e) => {
      return emojiUnicode(e)
    })

    let index = 0

    return string.replace(regex, function () {
      let unicodeEmoji = `&#x${convertedEmojis[index]};`
      index++
      return `${unicodeEmoji}`
    })
  }

  return string
}
```

First of all we create a regex to find all of the emojis in the string, taken from Kevin Scott's great post [emojis in javascript](https://thekevinscott.com/emojis-in-javascript/). If we then get a match in the string we map through the returned array converting and returning each value as a Unicode value. We then take our string and replace each emoji with the Unicode value prepended with `&#x` and appended with a `;` which turns our Unicode string into a HTML entity. Note `;` tells the browser that it is the end of the entity.

And that's it! Super simple but super effective in converting your emojis in astring.

Hope you enjoyed and let me know your thoughts
