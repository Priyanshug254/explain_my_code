import { useState } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown } from 'lucide-react';

const FileTreeNode = ({ node, level = 0, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDir = node.type === 'DIRECTORY';

    const handleClick = () => {
        if (isDir) {
            setIsOpen(!isOpen);
        } else {
            onSelect(node.path);
        }
    };

    return (
        <div style={{ userSelect: 'none' }}>
            <div
                onClick={handleClick}
                style={{
                    padding: '8px 12px',
                    paddingLeft: `${level * 15 + 12}px`,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: isDir ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '0.9rem',
                    borderRadius: '6px',
                    margin: '2px 5px',
                    transition: 'background 0.2s ease'
                }}
                className="tree-item"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 92, 231, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                {isDir && (
                    <span style={{ marginRight: '5px' }}>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
                <span style={{ marginRight: '8px', color: isDir ? '#f1c40f' : '#3498db' }}>
                    {isDir ? <Folder size={16} /> : <FileCode size={16} />}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {node.name}
                </span>
            </div>

            {isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeNode key={child.path} node={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree = ({ node, onSelect }) => {
    return (
        <div style={{ paddingTop: '5px' }}>
            <FileTreeNode node={node} onSelect={onSelect} />
        </div>
    );
};

export default FileTree;
