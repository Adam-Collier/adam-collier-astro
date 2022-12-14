---
layout: ../../layouts/BlogLayout.astro
title: Reduce Page Weight using Font Subsetting
description: Using Glyphhanger and pyftsubset let's reduce our page weight by subsettting our font files and only serving the glyphs our pages need.
published: 09/12/2019
---

Whilst building this site, it was early on in the redesign process that I decided I wanted to use the brilliant open source font [Inter](https://rsms.me/inter/). Created by the extremely talented Rasmus Andersson ([@rsms](https://twitter.com/rsms)) as an experiment in 2016 whilst working at Figma it has blown up in popularity and rightly so. With 2.5k glyphs, 18 styles and 33 features at the moment it gives designers and developers an incredible amount of variation to express themselves with no doubt one of the best open source fonts you can wish for. However, as much as I love the font there was one major issue when we got the site up and started to run some audits... Each woff2 font was an enormous 104kb each!

Which when I come to think about it no surprise with the amount of features packed into that 104kb. So I tweeted Rasmus about size of the woff2 files and he advised trying to subset the fonts. After a quick google and a few moments of coming to terms with the madness of fonts on the web I decided to give it a go.

So to begin the font subsetting journey I had to install a couple of things first.

```
$ pip install fonttools zopfli brotli
```

Note: If your not familiar with the pip command, its basically pythons package manager. Think of it as the python equivalent to NPM.

This will install some helpful python scripts which will help us in subsetting Inter.

I'm going to `cd` into the directory where my fonts are that I want to subset and run the below npm script

```
$ npx glyphhanger <https://fccmanchester.com> <https://fccmanchester.com/blog> <https://fccmanchester.com/upcoming-meetups> <https://fccmanchester.com/learning-resources> > glyphs.txt
```

This command runs an npm package called [glyphhanger](https://github.com/filamentgroup/glyphhanger), which is a web font utility belt (and apparently makes julienne fries). When the command is ran glyphhanger crawls all of the urls I passed as arguments, gathers a list of Unicode ranges that each page uses and stuffs it all in a text file. Now we know what to subset our font with!!

Weirdly enough glyphhanger doesn't let you subset from a text file ????????????? so I thought I'd just use the tool it uses under the hood,

Unfortunately when using gylphhanger it turns out we cant subset our font using the text file we just created! Therefore we need to use pyftsubset, which is a subsetting tool and part of thefonttools package (which we installed earlier).

Now this is where the magic happens...

```
$ pyftsubset Inter-Medium.woff --unicodes-file=glyphs.txt --flavor=woff --with-zopfli
$ pyftsubset Inter-Medium.woff --unicodes-file=glyphs.txt --flavor=woff2
$ pyftsubset Inter-SemiBold.woff --unicodes-file=glyphs.txt --flavor=woff --with-zopfli
$ pyftsubset Inter-SemiBold.woff --unicodes-file=glyphs.txt --flavor=woff2
$ pyftsubset Inter-ExtraBold.woff --unicodes-file=glyphs.txt --flavor=woff --with-zopfli
$ pyftsubset Inter-ExtraBold.woff --unicodes-file=glyphs.txt --flavor=woff2
```

So we use three Inter font weights on the site: medium, semi bold and extra bold. By running the above `pyftsubset` looks at the Unicode values in our `glyphs.txt` file, grabs all of glyphs from the font in that range and then outputs our `${FONTWEIGHT}.subset.woff` and `${FONTWEIGHT}.subset.woff2` files to our current directory. Now we just replace the existing fonts in our project with the subset files and we are done!

Now here's the thing, by subsetting our fonts we saw a huge improvement in file size. Remember how I said each font weight was 104kb... now they are 11kb each! That's an 89% reduction! ????

Of course as we write more blog posts and create more content we might find ourselves repeating this process but something like this could be integrated into our build process.

And that's it! I hope you enjoyed this little post about font subsetting, I certainly learned a lot figuring it all out. If you have any questions or just want to say "Hi" ???? hit me up on thy twitter.
