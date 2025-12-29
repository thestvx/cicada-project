// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setShowLangMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Nav>
      <Container>
        <Logo>
          <Link to="/dashboard">
            {i18n.language === 'ar' ? 'سيكادا' : 'Cicada'}
          </Link>
        </Logo>

        <MenuIcon onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <FiX /> : <FiMenu />}
        </MenuIcon>

        <Menu show={showMenu}>
          <MenuItem>
            <Link to="/dashboard">{t('dashboard.title')}</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/tasks">{t('tasks.title')}</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/investments">{t('investment.title')}</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/deposits">{t('common.deposit')}</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/withdrawals">{t('common.withdraw')}</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/profile">{t('common.profile')}</Link>
          </MenuItem>
          
          <LanguageSelector>
            <FiGlobe onClick={() => setShowLangMenu(!showLangMenu)} />
            {showLangMenu && (
              <LangDropdown>
                <LangOption onClick={() => changeLanguage('en')}>English</LangOption>
                <LangOption onClick={() => changeLanguage('ar')}>العربية</LangOption>
                <LangOption onClick={() => changeLanguage('fr')}>Français</LangOption>
              </LangDropdown>
            )}
          </LanguageSelector>

          <LogoutBtn onClick={handleLogout}>{t('common.logout')}</LogoutBtn>
        </Menu>
      </Container>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #1a1a2e;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  a {
    font-size: 1.8rem;
    font-weight: bold;
    color: #4ecca3;
    text-decoration: none;
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Menu = styled.ul`
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    ${props => props.show ? 'right: 0' : 'right: -100%'};
    width: 70%;
    height: 100vh;
    background: #1a1a2e;
    flex-direction: column;
    padding: 2rem;
    transition: 0.3s;
    z-index: 999;

    [dir="rtl"] & {
      ${props => props.show ? 'left: 0' : 'left: -100%'};
      right: auto;
    }
  }
`;

const MenuItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s;

    &:hover {
      color: #4ecca3;
    }
  }
`;

const LanguageSelector = styled.div`
  position: relative;
  
  svg {
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
  }
`;

const LangDropdown = styled.div`
  position: absolute;
  top: 100%;
  ${props => document.dir === 'rtl' ? 'left: 0' : 'right: 0'};
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  margin-top: 0.5rem;
  min-width: 120px;
  z-index: 1000;
`;

const LangOption = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const LogoutBtn = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

export default Navbar;
