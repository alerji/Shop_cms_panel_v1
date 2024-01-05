import axios from "axios";

const config = {
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
                    byFile: axios.defaults.baseURL + 'api/admin/html_uploader', // Your backend file uploader endpoint
                    byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                }
            }
        },
        linkTool: {
            class: LinkTool,
            config: {
                endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
            }
        },
        table: Table,
        raw: RawTool,

    }
}
export default config