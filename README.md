> **DriftWare fork: Ghost 6 refresh**
>
> Build and validate with Node 24: `npm ci --prefix src`, then
> `npm run production --prefix src`, `npm run check --prefix src`,
> and `npm test --prefix src`. Upload the resulting `liebling.zip` to Ghost.
>
> Browser libraries are pinned CDN imports. No consent manager, analytics wrapper,
> embed blocker, local library mirror or source from `liebling-old` is included.
> See [maintenance and Ghost feature support](docs/maintenance.md) for verification,
> dependency updates, deployment configuration and remaining limitations.
>
> The upstream preview, download and wiki links below describe the original theme;
> use this fork’s build commands and maintenance guide for development.

# Liebling

Liebling is a beautiful and clean Ghost theme that is easy and comfortable to use. **It's free** and you can use it for any kind of content you might have. Now with dark mode 🌓!

If you find this theme useful, please consider to make a donation to support its development! 🙏🏼

<a href="https://ko-fi.com/eddiesigner" target="_blank"><img src="https://res.cloudinary.com/edev/image/upload/v1583011476/button_y8hgt8.png" alt="Donate" style="width: 250px !important; height: 60px !important;" width="250" height="60"></a>

## Ghost 6

This fork targets Ghost 6. Older Ghost versions are not supported by this refresh.

## Preview

You can see a live demo here: [https://liebling.eduardogomez.io](https://liebling.eduardogomez.io)

![](https://res.cloudinary.com/edev/image/upload/v1583792928/liebling/liebling-promo-desktop.jpg)
<br><br>
![](https://res.cloudinary.com/edev/image/upload/v1570370297/liebling/liebling-promo-mobile.jpg)

## Download

To get the latest version please head over the [releases page](https://github.com/eddiesigner/liebling/releases) and download the file `liebling.zip` of the latest release.

## Documentation

To know how to enable the search, comments, newsletter and more, please head to the [Wiki](https://github.com/eddiesigner/liebling/wiki).

## Features

### General features

* Clean and beautiful design
* Lightning fast
* Lightweight and high performance
* Fully responsive, looks great on any device
* Compatible with modern browsers

### Ghost features

* Subscription form
* Multiple authors
* Logo support
* Secondary menu
* Accent color
* Featured posts and pages
* Post, Page, Tag, Authors, pages
* Koenig editor
* Bookmark card
* Gallery card
* Button card
* NFT card
* Callouts
* Toggles
* Quotes
* Products
* Audio
* Video
* File uploads
* Headers
* Blog title and description
* Cover image for Home, Post, Page, Tag, Author pages
* Author avatar, bio, location, website and social links
* Facebook and Twitter social links
* Reading time
* Next and Previous post navigation
* Primary tag in posts

### Liebling unique features

* Dark mode
* Search
* Custom settings
* Custom Subscribe page
* Custom authors page
* Custom error page
* Medium style image zoom
* Comments with Disqus
* Share post on Facebook and Twitter
* Slider for featured posts
* Support for normal, wide and full images in posts
* Reading progress indicator
* RTL language support

## Localization

* English
* Spanish
* German by [D3473R](https://github.com/D3473R)
* Informal german by [D3473R](https://github.com/D3473R)
* Bulgarian by [clappingmonkey](https://github.com/clappingmonkey)
* Vietnamese by [hiensarahly](https://github.com/hiensarahly)
* Italian by [vignini](https://github.com/vignini)
* French by [v1nc3nt-fr](https://github.com/v1nc3nt-fr)
* Informal french by [v1nc3nt-fr](https://github.com/v1nc3nt-fr)
* Portuguese by [ivomota](https://github.com/ivomota)
* Arabic by [allamiro](https://github.com/allamiro)
* Polish by [otlet](https://github.com/otlet)
* Brazilian portuguese by [pedrinholula](https://github.com/pedrinholula)
* Russian by [stereohorse](https://github.com/stereohorse)
* Kyrgyz by [januchaos](https://github.com/januchaos)
* Hebrew by [cohen604](https://github.com/cohen604)
* Turkish by [mskoroglu](https://github.com/mskoroglu)
* Romanian by [dsecareanu](https://github.com/dsecareanu)
* Chinese Simplified by [IvyB](https://github.com/IvyB)
* Indonesian by [iqbalbinsb](https://github.com/iqbalbinsb), [khannedy](https://github.com/khannedy)
* Lithuanian by [pintom](https://github.com/pintom)
* Dutch by [Qballjos](https://github.com/Qballjos)
* Traditional Chinese by [weixiang](https://github.com/weixiang)
* Persian (Farsi) by [Aminoiz](https://github.com/Aminoiz)
* Ukrainian by [partizan007](https://github.com/partizan007)
* Kazakh by [arshyn-t](https://github.com/arshyn-t)
* Korean by [chocosobo](https://github.com/chocosobo)
* Japanese by [ViaSnake](https://github.com/ViaSnake)
* Czech by [Fjuro](https://github.com/Fjuro)
* Swedish by [momeenme](https://github.com/momeenme)
* Slovak by [jjuris](https://github.com/jjuris)
* Thai by [Parinya T.](https://github.com/pickyzz)

## Validation and development

GScan, archive checks and template contracts run through the commands above.
Desktop and mobile browser checks use `npm run test:browser --prefix src`.
See [maintenance.md](docs/maintenance.md) for the test scope and known audit exception.

For a local development instance, run `docker compose -f src/docker-compose.yml up -d`
with Docker, then `npm run watch --prefix src` to rebuild theme assets.

## Help and Support

If you have any questions or troubles with this product, please feel free to open an issue [here](https://github.com/eddiesigner/liebling/issues).

## Contributing

Contributions are very welcome. First, please read the [Pull Request Guidelines](https://github.com/eddiesigner/liebling/wiki/Pull-Request-Guidelines) on the wiki.

## Related

* [Glow](https://eddiesigner.gumroad.com/l/glow) - Beautiful, clean, minimalist and powerful Ghost theme perfect for writers which offers a pleasant reading experience.

* [Bold](https://eddiesigner.gumroad.com/l/ltqtms) - Bold is a Ghost theme designed to be minimal and customizable, allowing individuals to create a sleek and modern online presence.

* [Galerie](https://eddiesigner.gumroad.com/l/KgroF) - Modern and versatile theme that stands out for its sleek design, it's incredibly fast, it offers a great user experience and it has many options to customise it.

* [Firma](https://gum.co/ZXLha) - Ghost theme that can be used by startups to large companies to publish any kind of articles related to their business. It stands out for its clean design and is able to adapt to any company's identity.

* [Weiss Pro](https://gum.co/pzvDn) - Modern and beautiful Ghost theme ready to make your content shine.

## License

Copyright (c) 2019-present Eduardo Gómez. Released under the [MIT license](https://github.com/eddiesigner/liebling/blob/master/LICENSE).

## Credits

All the photos I used in this theme were taken from [Unsplash](https://unsplash.com)
