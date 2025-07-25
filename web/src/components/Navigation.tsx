'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { config } from '@/lib/config';
import { MenuItem } from '@/lib/menu-utils';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(items => setMenuItems(items || []))
      .catch(err => {
        console.error('Navigation: Error fetching menu:', err);
        setMenuItems([]);
      });
  }, []);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Static links + dynamic menu items
  const staticLinks = [
    { href: '/posts', label: 'POSTS' },
    { href: '/events', label: 'EVENTS' },
    { href: '/tags', label: 'TAGS' },
  ];
  
  // Combine dynamic menu items first, then static links
  const allNavLinks = [
    ...menuItems.map(item => ({
      href: item.url,
      label: item.title.toUpperCase(),
      external: item.external
    })),
    ...staticLinks
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={closeMenu}
        />
      )}
      
      <nav className="fixed top-0 w-full z-50 bg-nav/90 border-b border-border backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-lg md:text-xl font-bold text-primary robot-text">
            {config.site.name}
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="space-x-6">
              {allNavLinks.map((link, index) => (
                link.external ? (
                  <a 
                    key={link.href + index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors robot-text text-sm"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.href + index}
                    href={link.href} 
                    className="hover:text-accent transition-colors robot-text text-sm"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="relative w-8 h-8 flex flex-col justify-center items-center group hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-[2px] bg-foreground transition-all duration-500 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block w-5 h-[2px] bg-foreground my-1 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[2px] bg-foreground transition-all duration-500 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[calc(100vh-80px)] mt-4 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="space-y-3 pb-4">
            {allNavLinks.map((link, index) => (
              link.external ? (
                <a
                  key={link.href + index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block py-3 px-4 text-foreground hover:text-accent hover:bg-primary/5 rounded-lg transition-all robot-text text-sm active:bg-primary/10"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href + index}
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-3 px-4 text-foreground hover:text-accent hover:bg-primary/5 rounded-lg transition-all robot-text text-sm active:bg-primary/10"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
      </>
  );
}
