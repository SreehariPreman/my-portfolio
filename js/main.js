const navbar = document.getElementById('navbar')
const menuToggle = document.getElementById('menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')
const menuIconOpen = document.getElementById('menu-icon-open')
const menuIconClose = document.getElementById('menu-icon-close')
const yearEl = document.getElementById('year')

const sections = ['about', 'tech-stack', 'contact']
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link')

/* Current year in footer */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear()
}

/* Navbar scroll effect */
const handleScroll = () => {
  if (!navbar) return
  navbar.classList.toggle('scrolled', window.scrollY > 40)
}

window.addEventListener('scroll', handleScroll, { passive: true })
handleScroll()

/* Mobile menu toggle */
const handleMenuToggle = () => {
  if (!mobileMenu || !menuToggle) return

  const isOpen = !mobileMenu.classList.contains('hidden')
  mobileMenu.classList.toggle('hidden')
  menuIconOpen?.classList.toggle('hidden', !isOpen)
  menuIconClose?.classList.toggle('hidden', isOpen)
  menuToggle.setAttribute('aria-expanded', String(!isOpen))
}

menuToggle?.addEventListener('click', handleMenuToggle)

/* Close mobile menu on link click */
document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.add('hidden')
    menuIconOpen?.classList.remove('hidden')
    menuIconClose?.classList.add('hidden')
    menuToggle?.setAttribute('aria-expanded', 'false')
  })
})

/* Hero entrance animation on load */
const animateHero = () => {
  const heroElements = document.querySelectorAll('#hero .reveal')
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('hero-visible')
    }, index * 120)
  })
}

window.addEventListener('load', animateHero)

/* Intersection Observer for scroll reveals */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
)

document.querySelectorAll('.reveal').forEach((el) => {
  if (!el.closest('#hero')) {
    revealObserver.observe(el)
  }
})

/* Active section highlight in nav */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const id = entry.target.id
      navLinks.forEach((link) => {
        const href = link.getAttribute('href')
        link.classList.toggle('active', href === `#${id}`)
      })
    })
  },
  { threshold: 0.4, rootMargin: '-20% 0px -55% 0px' }
)

sections.forEach((id) => {
  const section = document.getElementById(id)
  if (section) sectionObserver.observe(section)
})

/* Stagger skill tags on card hover */
document.querySelectorAll('.tech-card').forEach((card) => {
  const tags = card.querySelectorAll('.skill-tag')

  card.addEventListener('mouseenter', () => {
    tags.forEach((tag, i) => {
      tag.style.transitionDelay = `${i * 30}ms`
      tag.style.color = '#0f172a'
      tag.style.borderColor = 'rgba(2, 132, 199, 0.3)'
    })
  })

  card.addEventListener('mouseleave', () => {
    tags.forEach((tag) => {
      tag.style.transitionDelay = '0ms'
      tag.style.color = ''
      tag.style.borderColor = ''
    })
  })
})
