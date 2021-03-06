---
title: Create an accessible dropdown navigation
date: '2018-12-04'
path: '/blog/create-accessible-dropdown-navigation'
tags: ['accessibility', 'navigation', 'javascript', 'front end web development']
published: true
affiliate: false
featuredImage: './create-dropdown-js.png'
draft: false
hasAudio: true
audioLink: https://www.parler.io/audio/7119149108/fa3668f4a9c5c5483cd4424d1c0bbc5a45401e35.6e119819-3442-454a-863e-8c0f7276101b.mp3
---

Hover navigations are pretty simple to do without JavaScript, which is how I usually see them implemented. The HTML and CSS are pretty simple.

HTML:

```html
<nav>
  <ul class="menu">
    <li class="menu__item">
      <a href="/about" class="menu__link">About</a>
      <ul class="submenu">
        <li class="submenu__item">
          <a class="submenu__link" href="/about/our-mission">Our Mission</a>
        </li>
        <li class="submenu__item">
          <a class="submenu__link" href="/about/our-team">Our Team</a>
        </li>
      </ul>
    </li>
    <li class="menu__item">
      <a href="/news" class="menu__link">News</a>
      <ul class="submenu">
        <li class="submenu__item">
          <a href="/news/press-releases" class="submenu__link"
            >Press Releases</a
          >
        </li>
        <li class="submenu__item">
          <a href="/news/blog" class="submenu__link">Blog</a>
        </li>
        <li class="submenu__item">
          <a href="/news/in-the-media" class="submenu__link">In the Media</a>
        </li>
      </ul>
    </li>
    <li class="menu__item">
      <a href="/contact" class="menu__link">Contact</a>
    </li>
  </ul>
</nav>
```

CSS:

```css
.submenu {
  position: absolute;
  left: 0;
  padding: 0;
  list-style: none;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
}

.menu__item:hover .submenu {
  padding: 0.5rem 0;
  width: 9rem;
  height: auto;
  background: #eedbff;
  clip: auto;
}
```

Note: I have used the [visually-hidden](https://a11yproject.com/posts/how-to-hide-content/) styling instead of `display: none`. This is important for accessibility, and you can read more in the link above.

I've taken out some of the general styling, but this CSS is what contributes to the hover effect. However, as you can see with the gif below, it doesn't work the same way if you use your tab key.

<img class="center" src="https://media.giphy.com/media/2zowLUY2M9lEhvFc6m/giphy.gif" alt="Gif of mouse hovering over navigation displaying the submenu, and the top level items receiving focus and not doing anything.">

Before we jump into coding, I wanted to share my approach to this problem. First, I want to solve the problem of opening the nav on not only on hover but also on focus. Second, I want to ensure that on focus each submenu "opens" as it does with the hover. Third, I want to make sure that once I tab through the links, that particular submenu closes when I leave it. Now let's get started!

## Replicating the hover effect on focus

Because we have the `:hover` pseudo-class on the `li` element, we should also target our focus on the `li` element. But if you read my blog post on [Keyboard Accessibility](/blog/3-simple-tips-improve-keyboard-accessibility), you'll recognize the concept of tabindexes. `li` elements do not have tabindexes, but links do. What I personally like to do is target the top level links in JavaScript and add a class to their parents on a focus event. Let's walk through that a little further.

```js
const topLevelLinks = document.querySelectorAll('.menu__link')
console.log(topLevelLinks)
```

![Google Chrome console displaying a NodeList of the menu link class.](./menu-link-nodelist.png)

When I `console.log` the variable, I get a node list of the top menu items. What I like to do is loop through those using a `forEach` loop and then log each of their `parentElement`'s.

```js
topLevelLinks.forEach(link => {
  console.log(link.parentElement)
})
```

![Google Chrome console displaying all the top level list items elements.](./list-item-elements.png)

Now what I want to do is add a `focus` event listener to the link, and then console.log `this` to ensure to double check that we have the correct context of `this`.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    console.log(this)
  })
})
```

![Google Chrome console displaying the About link on focus, as that is the context of this.](./demonstrate-this.png)

I am using an old-school function (instead of an ES6+ arrow function) because I want to ensure the context of `this` is the target. There are plenty of blog posts about this (haha, see what I did there) if you'd like to read more on it. Anyways, now I'd like to have it so that we are targeting the `parentElement` of this, which is the `li`.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    console.log(this.parentElement)
  })
})
```

![Google Chrome console displaying the list item for About on focus, as that is the context of the parent of this.](./demonstrate-this-parent.png)

This parent element is what we need to target. What I am going to do is add a class to the li that we logged to the console. Then what I will do is use a CSS class to replicate the styling we have on `:hover`.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    this.parentElement.classList.add('focus')
  })
})
```

<img class="center" src="https://media.giphy.com/media/8vLkeYAqm3AeRoWGTP/giphy.gif" alt="Gif displaying the adding of the focus class as we tab to the top level menu items.">

```css
.menu__item:hover .submenu,
.menu__item.focus .submenu {
  padding: 0.5rem 0;
  width: 9rem;
  height: auto;
  background: #eedbff;
  clip: auto;
}
```

<img class="center" src="https://media.giphy.com/media/1k4svGjvxOSwCdijta/giphy.gif" alt="Gif displaying what adding the styling to the focus class does, similar to the hover pseudo-class.">

As you'll see, the menu doesn't close after we leave it which is one of our action items that I laid out. Before we do that, let's take a second to learn about the `blur` event and what that means.

## The Blur Event

Per Mozilla docs, the [blur event](https://developer.mozilla.org/en-US/docs/Web/Events/blur) is fired when an element **loses** focus. We want to keep the submenu open until the last submenu item loses focus. So what we need to do is remove the focus class on blur.

The first thing I like to do is within that forEach loop we have, is to check if there is a `nextElementSibling`.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    this.parentElement.classList.add('focus')
  })

  console.log(link.nextElementSibling)
})
```

![Google Chrome console displaying 2 unordered list elements with the class of submenu and null.](./check-next-element.png)

Next what I will do is create a conditional. We only want to run the following code IF there is a submenu. Here is what I did:

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    this.parentElement.classList.add('focus')
  })

  if (link.nextElementSibling) {
    const subMenu = link.nextElementSibling
    console.log(subMenu)
    console.log(subMenu.querySelectorAll('a'))
  }
})
```

![Google Chrome console displaying both the unordered list elements with the class of submenu and the NodeLists associated with the links below them.](./submenu-and-submenu-nodelist.png)

The reason I log both the `subMenu` and the `querySelectorAll` is for visual learning. It's good for me to see that I have both submenu elements targeted correctly, as well as the NodeList for the links within them. So what I want to do here is target the last link in that `querySelectorAll`. Let's put it into a variable to make it more readable.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    this.parentElement.classList.add('focus')
  })

  if (link.nextElementSibling) {
    const subMenu = link.nextElementSibling
    const subMenuLinks = subMenu.querySelectorAll('a')
    const lastLinkIndex = subMenuLinks.length - 1
    console.log(lastLinkIndex)
    const lastLink = subMenuLinks[lastLinkIndex]
    console.log(lastLink)
  }
})
```

![Google Chrome console displaying the index number of the last link item and the element of the last link.](./last-item-index-and-link.png)

On each of these last links, we want to add a blur event that removes the class from that `li`. First, let's check out the `link.parentElement` to ensure that we are getting what we expect.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    this.parentElement.classList.add('focus')
  })

  if (link.nextElementSibling) {
    const subMenu = link.nextElementSibling
    const subMenuLinks = subMenu.querySelectorAll('a')
    const lastLinkIndex = subMenuLinks.length - 1
    const lastLink = subMenuLinks[lastLinkIndex]

    lastLink.addEventListener('blur', function() {
      console.log(link.parentElement)
    })
  }
})
```

<img class="center" src="https://media.giphy.com/media/jUgOxI3K1QIPLgx8l3/giphy.gif" alt="Gif displaying the parent element in the console after we tab away from the last item in that submenu.">

Now that we have what we expect, I am going to do the opposite that I do on the focus event listener.

```js
topLevelLinks.forEach(link => {
  link.addEventListener('focus', function() {
    this.parentElement.classList.add('focus')
  })

  if (link.nextElementSibling) {
    const subMenu = link.nextElementSibling
    const subMenuLinks = subMenu.querySelectorAll('a')
    const lastLinkIndex = subMenuLinks.length - 1
    const lastLink = subMenuLinks[lastLinkIndex]

    lastLink.addEventListener('blur', function() {
      link.parentElement.classList.remove('focus')
    })
  }
})
```

<img class="center" src="https://media.giphy.com/media/1xVfHck3wmbrBtwEWt/giphy.gif" alt="Gif showing menu that opens and closes when we tab through the links and the submenu.">

One last thing I am going to do is place the focus event listener within that conditional statement. The reality is that we don't need to add a focus class to an item that doesn't have a submenu.

```js
topLevelLinks.forEach(link => {
  if (link.nextElementSibling) {
    link.addEventListener('focus', function() {
      this.parentElement.classList.add('focus')
    })

    const subMenu = link.nextElementSibling
    const subMenuLinks = subMenu.querySelectorAll('a')
    const lastLinkIndex = subMenuLinks.length - 1
    const lastLink = subMenuLinks[lastLinkIndex]

    lastLink.addEventListener('blur', function() {
      link.parentElement.classList.remove('focus')
    })
  }
})
```

## Additional Challenges

This blog post is getting VERY long, so maybe I'll do a follow-up post next week. The one thing I haven't solved here that I'd like to in my follow-up post is how to go backward in the menu. If you use the `tab` and `shift` key simultaneously, this doesn't work when going back in the menu. If you want an additional challenge, try it out yourself!

So that's it for now! I'd love to see how you come up with a solution to this if it's different from mine. Let me know on [Twitter](https://twitter.com/LittleKope/) what you think!
