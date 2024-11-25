class ProductGrid {
    static get toolbox() {
        return {
            title: 'ProductGrid',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, api, config }) {
        this.api = api;
        this.data = {
            selectedCat: data.selectedCat || '',
            selectedTag: data.selectedTag || '',
            inputValue: data.inputValue || '',
            options: []
        };

        this.wrapper = undefined;
        this.settings = {
            apiCatEndpoint: config.apiCatEndpoint || 'https://api.example.com/options',
            apiTagEndpoint: config.apiTagEndpoint || 'https://api.example.com/options',
        };
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('custom-plugin-wrapper');

        // Create select element
        const selectCatContainer = document.createElement('div');
        selectCatContainer.classList.add('custom-plugin-select-container');

        // Create select element
        const selectTagContainer = document.createElement('div');
        selectTagContainer.classList.add('custom-plugin-select-container');

        const selectCatLabel = document.createElement('label');
        selectCatLabel.textContent = 'دسته بندی:';

        const selectTagLabel = document.createElement('label');
        selectTagLabel.textContent = 'تگ محصول:';

        const selectCat = document.createElement('select');
        const selectTag = document.createElement('select');
        selectCat.classList.add('custom-plugin-select');
        selectTag.classList.add('custom-plugin-select');

        // Loading state
        const loadingOption = document.createElement('option');
        loadingOption.textContent = 'انتخاب کنید';
        loadingOption.value = '0';

        const loadingOption2 = document.createElement('option');
        loadingOption2.textContent = 'انتخاب کنید';
        loadingOption2.value = '0';

        selectCat.appendChild(loadingOption);
        selectTag.appendChild(loadingOption2);
const self = this
        // Fetch options from API
        this.fetchCats().then(options => {
            // selectCat.innerHTML = ''; // Clear loading state
            // selectTag.innerHTML = ''; // Clear loading state

            options.cat.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.source;
                optionElement.textContent = option.title;

                if (option.source == self.data.selectedCat) {
                    optionElement.selected = true;
                }
                selectCat.appendChild(optionElement);
            });
            options.tag.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.source;
                optionElement.textContent = option.title;
                if (option.source == self.data.selectedTag) {
                    optionElement.selected = true;
                }
                selectTag.appendChild(optionElement);
            });
        });



        // Create input element
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('custom-plugin-input-container');

        const inputLabel = document.createElement('label');
        inputLabel.textContent = 'تعداد محصول:';

        const input = document.createElement('input');
        input.classList.add('custom-plugin-input');
        input.type = 'text';
        input.value = this.data.inputValue;

        input.addEventListener('input', (event) => {
            this.data.inputValue = event.target.value;
        });
        selectCat.addEventListener('change', (event) => {
            this.data.selectedCat = event.target.value;

        });
        selectTag.addEventListener('change', (event) => {
            this.data.selectedTag = event.target.value;

        });
        // Append elements
        selectCatContainer.appendChild(selectCatLabel);
        selectCatContainer.appendChild(selectCat);

        selectTagContainer.appendChild(selectTagLabel);
        selectTagContainer.appendChild(selectTag);

        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(input);

        this.wrapper.appendChild(selectCatContainer);
        this.wrapper.appendChild(selectTagContainer);
        this.wrapper.appendChild(inputContainer);

        // Add styles
        this.addStyles();

        return this.wrapper;
    }

    async fetchCats() {
        try {
            const response = await fetch(this.settings.apiCatEndpoint);
            const data = await response.json();
            this.data.options = data;
            return data;
        } catch (error) {
            console.error('Error fetching options:', error);
            return [];
        }
    }
    async fetchTags() {
        try {
            const response = await fetch(this.settings.apiTagEndpoint);
            const data = await response.json();
            this.data.options = data;
            return data;
        } catch (error) {
            console.error('Error fetching options:', error);
            return [];
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
      .custom-plugin-wrapper {
        padding: 15px;
        background: #f9f9f9;
        border-radius: 4px;
      }

      .custom-plugin-select-container,
      .custom-plugin-input-container {
        margin-bottom: 10px;
      }

      .custom-plugin-select,
      .custom-plugin-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 5px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
    `;
        document.head.appendChild(style);
    }

    save() {
        console.log("save product grid is ",
            {
                selectedCat: this.data.selectedCat,
                selectedTag: this.data.selectedTag,
                inputValue: this.data.inputValue
            })
        return {
            selectedCat: this.data.selectedCat,
            selectedTag: this.data.selectedTag,
            inputValue: this.data.inputValue
        };
    }

    validate(data) {
        console.log("validate is ",data.selectedCat.trim() !== '' && data.selectedTag.trim() !== '' && data.inputValue.trim() !== '')
        return data.selectedCat.trim() !== '' && data.selectedTag.trim() !== '' && data.inputValue.trim() !== '';
    }
}