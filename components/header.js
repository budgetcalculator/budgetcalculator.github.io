// Header Component
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
                  <li><a href="tax-calculator" class="nav-link">Tax</a></li>
                  <li><a href="investment-roi" class="nav-link">Investment</a></li>
                  <li><a href="debt-payoff" class="nav-link">Debt</a></li>
                  <li><a href="retirement-planner" class="nav-link">Retirement</a></li>
                  <li><a href="mortgage-calculator" class="nav-link">Mortgage</a></li>              
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
                  <li><a href="tax-calculator" class="nav-link">Tax</a></li>
                  <li><a href="investment-roi" class="nav-link">Investment</a></li>
                  <li><a href="debt-payoff" class="nav-link">Debt</a></li>
                  <li><a href="retirement-planner" class="nav-link">Retirement</a></li>
                  <li><a href="mortgage-calculator" class="nav-link">Mortgage</a></li> 
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
