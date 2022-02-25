import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { is_authenticated } from '../store/auth';
import { Logo } from '../store/constants';
import { signOutUrl } from '../store/constants';

function Header() {
  const navigate = useNavigate();
  async function handleSignOutUser(event) {
  console.log('signing out');
  event.preventDefault();
  Swal.fire({
  title: 'Are you sure You want to Sign Out?',
  // text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, Sign Out!'
}).then((result) => {
  if (result.isConfirmed) {
    // window.href = '/accounts/sign-out/';
    // navigate(signOutUrl);navigate(signOutUrl);
    window.location.href = signOutUrl;

    // Swal.fire(
    //   'Success!',
    //   'You have been Signed Out.',
    //   'success'
    // )
  }
})
}
  const [top, setTop] = useState(true);
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top])
  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href='/'>
          <div className="flex flex-row">
            <div>
                <img className="h-8 w-8 sm:h-8" src={Logo} alt="Connect" />
            </div>
            <div className='pl-2 text-xl text-blue-700'>
              Connect.
            </div>
          </div>
            </a>
          <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center">
              {is_authenticated == "true" ? <>
                {/* <li>
                  <a href='/accounts/sign-in/' className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                    Connect
                  </a>
                </li> */}
                <li>
                  <a onClick={(event) => handleSignOutUser(event)} className="btn-sm text-white bg-red-600 hover:bg-red-700 ml-3">
                    <span>
                      Sign Out
                    </span>
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </a>
                </li>
              </> : <>
                <li>
                  <a href='/accounts/sign-in/' className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                    Sign in
                  </a>
                </li>
                <li>
                  <a href="/accounts/sign-up/" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                    <span>
                      Sign up
                    </span>
                    <svg className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                    </svg>
                  </a>
                </li>
              </>}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;