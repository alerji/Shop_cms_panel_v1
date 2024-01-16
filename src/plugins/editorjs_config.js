import axios from "axios";

export const editorjs_config = {
    /**
     * Id of Element that should contain the Editor
     */
    placeholder: 'Let`s write an awesome story!',

    holder: 'editorjs',
    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    tools: {
        header: Header,
        list: List,
        image: {
            class: ImageTool,
            config: {
                endpoints: {
                    byFile: 'https://db.charlotte-perfume.ir/api/admin/html_uploader', // Your backend file uploader endpoint
                    byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                }
            }
        },
        linkTool: {
            class: LinkTool,
            config: {
                endpointList: 'https://db.charlotte-perfume.ir/api/admin/product/editor-url-search', // Your backend endpoint for url data fetching,
                endpointUrl: 'https://db.charlotte-perfume.ir/api/admin/product/editor-url-product', // Your backend endpoint for url data fetching,
            }
        },
        table: Table,
        raw: RawTool,
        style: EditorJSStyle.StyleInlineTool,
        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config:{
                defaultAlignment: 'right',
            }
        },
        toggle: {
            class: ToggleBlock,
            inlineToolbar: true,
        },

        embed: Embed,

    }
}


export const parser_config = {
    image: {
        use: "figure",
        // use figure or img tag for images (figcaption will be used for caption of figure)
        // if you use figure, caption will be visible
        imgClass: "img", // used class for img tags
        figureClass: "fig-img", // used class for figure tags
        figCapClass: "fig-cap", // used class for figcaption tags
        path: "absolute",
        // if absolute is passed, the url property which is the absolute path to the image will be used
        // otherwise pass a relative path with the filename property in <> like so: '/img/<fileName>'
    },
    paragraph: {
        pClass: "paragraph", // used class for paragraph tags
    },
    code: {
        codeBlockClass: "code-block", // used class for code blocks
    },
    embed: {
        useProvidedLength: false,
        // set to true if you want the returned width and height of editorjs to be applied
        // NOTE: sometimes source site overrides the lengths so it does not work 100%
    },
    quote: {
        applyAlignment: false,
        // if set to true blockquote element will have text-align css property set
    },
};
