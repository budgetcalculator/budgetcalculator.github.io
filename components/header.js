const Header = {
  render() {
    const nav = document.getElementById('site-header');
    if (!nav) return;
    nav.innerHTML = `
      <header class="site-header" role="banner">
        <div class="header-inner">
          <a href="/" class="logo" aria-label="BudgetCalc Home">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <path d="M8 10h16M8 16h10M8 22h13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="24" cy="22" r="4" fill="#F59E0B" stroke="white" stroke-width="1.5"/>
                <path d="M24 20v4M22 22h4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="logo-text">Budget<span class="logo-accent">Calc</span></span>
          </a>

          <nav class="main-nav" role="navigation" aria-label="Main navigation">
            <ul class="nav-list">
              <li><a href="/" class="nav-link">Home</a></li>
              <li class="nav-item-dropdown">
                <button class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                  Calculators
                  <svg class="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <ul class="dropdown-menu">
                  <li><a href="tax-calculator" class="dropdown-link">Tax Calculator</a></li>
                  <li><a href="investment-roi" class="dropdown-link">Investment ROI</a></li>
                  <li><a href="debt-payoff" class="dropdown-link">Debt Payoff</a></li>
                  <li><a href="retirement-planner" class="dropdown-link">Retirement Planner</a></li>
                  <li><a href="mortgage-calculator" class="dropdown-link">Mortgage Calculator</a></li>
                </ul>
              </li>
              <li><a href="about" class="mobile-nav-link">About</a></li>
              <li><a href="contact" class="mobile-nav-link">Contact</a></li>  
            </ul>
          </nav>

          <div class="header-actions">
            <a href="/#calculator" class="btn-primary-sm">Start Free</a>
            <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
          <ul class="mobile-nav-list">
          <li><a href="/" class="mobile-nav-link">Home</a></li>
            <li><strong>Calculators</strong></li>
            <li><a href="tax-calculator" class="dropdown-link">Tax Calculator</a></li>
                  <li><a href="investment-roi" class="dropdown-link">Investment ROI</a></li>
                  <li><a href="debt-payoff" class="dropdown-link">Debt Payoff</a></li>
                  <li><a href="retirement-planner" class="dropdown-link">Retirement Planner</a></li>
                  <li><a href="mortgage-calculator" class="dropdown-link">Mortgage Calculator</a></li>
            <hr />
            <li><a href="about" class="mobile-nav-link">About</a></li>
            <li><a href="contact" class="mobile-nav-link">Contact</a></li>            
          </ul>
        </div>
      </header>
    `;

    this.initEvents();
  },

  initEvents() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.querySelector('.site-header');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    // Desktop Dropdown Toggle
    dropdownToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdownToggle?.setAttribute('aria-expanded', 'false');
    });

    // Mobile Hamburger
    hamburger?.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    window.addEventListener('scroll', () => {
      header?.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
};
