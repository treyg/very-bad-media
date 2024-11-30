const NAV_ITEMS = [
  {
    label: 'Movies',
    href: '/movies'
  },
  {
    label: 'Books',
    href: '/books'
  },
  {
    label: 'Short Stories',
    href: '/shortstories'
  },
  {
    label: 'Articles',
    href: '/articles'
  },
  {
    label: 'Essays',
    href: '/essays'
  },
  ,
  {
    label: 'Letterboxd',
    href: '/letterboxd'
  },
  {
    label: 'About',
    href: '#',
    children: [
      {
        label: 'About the Site',
        href: '/about-site'
      },
      {
        label: 'About the Podcast',
        href: '/about-podcast'
      }
    ]
  }
]

export default NAV_ITEMS
