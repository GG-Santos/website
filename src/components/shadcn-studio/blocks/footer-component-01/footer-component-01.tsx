import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import Logo from '@/assets/svg/logo'

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className='custom-footer-top'>
        <a href='/' className="custom-footer-logo-link">
          <div className='custom-footer-logo-wrapper'>
            <Logo className='custom-footer-logo' />
            <span className="custom-footer-brand">
              <span className="custom-footer-brand-bold">Underdogs</span>/<span className="custom-footer-brand-normal">studio</span>
            </span>
          </div>
        </a>

        <div className='custom-footer-nav'>
          <a href='/home' className="custom-footer-link magic-hover magic-hover__square">Home</a>
          <a href='/about' className="custom-footer-link magic-hover magic-hover__square">About</a>
          <a href='/collection' className="custom-footer-link magic-hover magic-hover__square">Collection</a>
          <a href='/blog' className="custom-footer-link magic-hover magic-hover__square">Blog</a>
          <a href='/contact' className="custom-footer-link magic-hover magic-hover__square">Contact</a>
        </div>

        <div className='custom-footer-social'>
          <a href='#' className="custom-footer-social-link">
            <FacebookIcon className='custom-footer-social-icon' />
          </a>
          <a href='#' className="custom-footer-social-link">
            <InstagramIcon className='custom-footer-social-icon' />
          </a>
          <a href='#' className="custom-footer-social-link">
            <TwitterIcon className='custom-footer-social-icon' />
          </a>
          <a href='#' className="custom-footer-social-link">
            <YoutubeIcon className='custom-footer-social-icon' />
          </a>
        </div>
      </div>

      <div className="custom-footer-separator" />

      <div className='custom-footer-bottom'>
        <p className='custom-footer-copyright'>
          {`©${new Date().getFullYear()}`} <a href='#' className="custom-footer-copyright-link">Underdogs/studio</a>, Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
