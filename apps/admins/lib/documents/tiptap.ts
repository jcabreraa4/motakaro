import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { StarterKit } from '@tiptap/starter-kit';
import { ImageResize } from 'tiptap-extension-resize-image';

export const tiptapExtensions = [StarterKit.configure({ link: false }), TextStyleKit, ImageResize, TaskList, TaskItem.configure({ nested: true }), TableKit.configure({ table: { resizable: true } }), Highlight.configure({ multicolor: true }), Link.configure({ openOnClick: true, autolink: true, defaultProtocol: 'https' }), TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] })];
