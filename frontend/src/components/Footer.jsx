import { Github, Heart, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'rgba(20, 20, 30, 0.95)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                Built with <Heart size={12} fill="#e74c3c" color="#e74c3c" /> by <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>You</span>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <a href="#" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                    <Github size={14} /> GitHub
                </a>
                <a href="#" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                    <Twitter size={14} /> Twitter
                </a>
            </div>
        </footer>
    );
};

export default Footer;
