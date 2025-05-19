import vgrLogoDesktop from '../../assets/vgr-logo-desktop.svg';
import vgrLogoMobile from '../../assets/vgr-logo-mobil-vit.svg';
import vgrLogoFooter from '../../assets/vgr-logo-footer.svg';
import {Link} from '@remix-run/react';
type Device = 'small' | 'lgblack' | 'lgwhite';
const logoConfig: Record<Device, {src: string; className: string}> = {
   small: {src: vgrLogoMobile, className: 'h-5 '},
   lgblack: {src: vgrLogoDesktop, className: 'h-14'},
   lgwhite: {src: vgrLogoFooter, className: 'h-8 desktop:h-14'},
};

interface LogoProps {
   context: keyof typeof logoConfig;
}

const Logo = ({context = 'desktop'}: LogoProps) => {
   const {src, className} = logoConfig[context];

   return (
      <Link to="/" className="flex items-center gap-4 z-10" aria-label="Till startsidan">
         <div className="flex items-center justify-center">
            <img src={src} alt={`${context} Logo`} className={`${className}`} aria-hidden="true" />
         </div>
      </Link>
   );
};

export default Logo;
