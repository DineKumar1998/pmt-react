const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <small>&copy; {year} PI3 - PMT. All rights reserved.</small>
    </footer>
  );
};

export default Footer;
