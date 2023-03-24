const navToggleButton = document.getElementById('nav-toggle')
const navMenuTarget = document.getElementById('nav-menu')
const navLink = document.querySelectorAll('.nav__link')

/*============================= Show Nav Menu =============================*/
const showNavMenu = () => {
  if (navToggleButton && navMenuTarget) {
    navToggleButton.addEventListener('click', () => {
      navMenuTarget.classList.toggle('show-menu')
    })
  }
}
showNavMenu()

/*============================= Nav Link Click Event Handler =============================*/
const navLinkClickHandler = () => {
  navMenuTarget.classList.remove('show-menu') // Close nav menu if any nav link is clicked.
}
navLink.forEach(n => n.addEventListener('click', navLinkClickHandler))

/*==================== Active the Corresponding Link of Current Section ====================*/
const sections = document.querySelectorAll('section[id]')

const navLinkActiveHandler = () => {
  sections.forEach(current => {
    const sectionId = current.getAttribute('id')
    const sectionTop = current.offsetTop - 50
    const sectionHeight = current.offsetHeight
    const activeLink = document.querySelector('.nav__link[href*=' + sectionId + ']')

    if (!activeLink) return

    if (this.scrollY > sectionTop && this.scrollY <= sectionTop + sectionHeight) {
      activeLink.classList.add('active-link')
    } else {
      activeLink.classList.remove('active-link')
    }
  })
}
window.addEventListener('scroll', navLinkActiveHandler)

/*============================= Scroll Top =============================*/
const scrollTopHandler = () => {
  const scrollTopButton = document.getElementById('scroll-top')
  if (this.scrollY >= 200) {
    scrollTopButton.classList.add('show-scroll')
  } else {
    scrollTopButton.classList.remove('show-scroll')
  }
}
window.addEventListener('scroll', scrollTopHandler)

/*============================= Switch Dark/Light Theme =============================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'
const pdfButtonMobile = document.getElementById('home-pdf__button--mobile')

// Previously selected theme
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Get currently selected theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme)
  themeButton.classList.toggle(iconTheme)

  localStorage.setItem('selected-theme', getCurrentTheme())
  localStorage.setItem('selected-icon', getCurrentIcon())
})

/*============================= Reduce the Size & Print on An A4 Sheet =============================*/
const scaleCV = () => {
  document.body.classList.add('scale-cv')
}

/*============================= Remove the Size When the CV Is Downloaded =============================*/
const removeScale = () => {
  document.body.classList.remove('scale-cv')
}

/*============================= Download PDF from Folder =============================*/
const downloadPDF = async () => {
  const theme = getCurrentTheme()
  const response = await fetch(`assets/pdf/resumeCV--${theme}.pdf`)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `wenchunliu_Resume--${theme}.pdf`)
  link.click()
  link.addEventListener('load', () => {
    URL.revokeObjectURL(url)
    link.remove()
  })
}

/*============================= Generate PC PDF =============================*/
const pdfButton = document.getElementById('pdf-button')

const generatePDF = () => {
  return new Promise((resolve, reject) => {
    const element = document.getElementById('resume-pdf-area')
    const opt = {
      margin:       0,
      filename:     'wenchunliu_Resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { format: 'a4', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save().then(() => {
      resolve()
    }).catch((error) => {
      reject(error)
    })
  })
}

pdfButton.addEventListener('click', () => {
  scaleCV()
  generatePDF().then(() => {
    setTimeout(removeScale, 3000)
  }).catch((error) => {
    console.log('Download PDF Failed: ', error)
  })
})
