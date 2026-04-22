import { BulletList, TaskItem, TaskList } from '@tiptap/extension-list';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { ImageResize } from 'tiptap-extension-resize-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { TableKit } from '@tiptap/extension-table';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';

export const tiptapExtensions = [StarterKit.configure({ link: false }), TextStyleKit, ImageResize, BulletList, TaskList, TaskItem.configure({ nested: true }), TableKit.configure({ table: { resizable: true } }), Highlight.configure({ multicolor: true }), Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }), TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] })];
