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
                    padding: '6px 10px',
                    paddingLeft: `${level * 15 + 10}px`,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: isDir ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '0.9rem'
                }}
                className="tree-item"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
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
