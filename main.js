function dataHandler(){
    const _key = "todo";

    function addToLocalStorage(data) {
        if (typeof data != "string") {data = JSON.stringify(data);}
        localStorage.setItem(_key, data);
      }
    
    function getFromLocalStorage() {
        const currentData = JSON.parse(localStorage.getItem(_key));
        return currentData; 
      }
    
    function clearLocalStorage() {
        localStorage.removeItem(_key);
    }

    return{
        addToLocalStorage,
        getFromLocalStorage,
        clearLocalStorage
    };
}

function localStorageUpdater(){
    const _dataHandler = dataHandler();
    let _id;

    // Get the latest _id from the storage
    const currentDataArray = getData();
    if (!currentDataArray?.length){
        _id = 0;
    } else _id = currentDataArray[currentDataArray.length - 1].id;

  
    function addData(title, description, priority, date, checked) {
        // Create the data obj
        const data = createToDo(title, description, priority, date, checked);
        // Get the dataArray from local storage
        let dataArray = getData();
        dataArray = dataArray === null ? [] : dataArray;
        // Check if data already exist
        const exists = dataArray.some((todo) => todo.id === data.id);
        if (exists) return;
        // Update the local storage
        dataArray.push(data);
        updateLocalStorage(dataArray);
    }
    
    function removeData(id){
        // Get the dataArray from local storage
        let dataArray = getData();
        if (dataArray === null) return;
        // Filter the data array
        const filteredData = dataArray.filter((todo) => todo.id !== id);
        // Update the local storage
        updateLocalStorage(filteredData);
    }

    function toggleChecked(id){
        // Get the dataArray from local storage
        let dataArray = getData();
        if (dataArray === null) return;
        
        dataArray.forEach((todo) => {
            if (todo.id === id) todo.checked = !todo.checked;
        })
        // Update the local storage
        updateLocalStorage(dataArray);
    }


    // Return the sorted data by the dates and put checked to the last
    function sortData(){
        const dataArray = getData();
        if (!dataArray?.length) return;
        let uncheckedArray = [];
        let checkedArray = [];
        dataArray.forEach((todo) => {
            if (todo.checked) {
                checkedArray.push(todo);
            } else uncheckedArray.push(todo);
        });
        // Sort each array
        if (checkedArray?.length) checkedArray.sort((a, b) => a.date - b.date);
        if (uncheckedArray?.length) uncheckedArray.sort((a, b) => a.date - b.date);

        return [...uncheckedArray, ...checkedArray];
    }

    function createToDo(title, description, priority, date, checked = false){
        _id++;
        return {
            id: _id,
            title,
            description,
            priority,
            date,
            checked,
        };
    }

    function getData(){
        return _dataHandler.getFromLocalStorage();
    }

    function updateLocalStorage(dataArray) {
        // Clear the local storage
        _dataHandler.clearLocalStorage();
        // Add the data to localStorage
        _dataHandler.addToLocalStorage(dataArray);
    }
    return {
        // Add data (title, description, priority, date, checked)
        addData,
        // Remove a data by id
        removeData,
        // Return a the sorted data by date
        sortData,
        // Toggle checked
        toggleChecked,
    };

}

function dateHandler(){
    // Functions for Date
    function getTodayDate(){
        let today = new Date();
        return convertDate(today);
    }

    function getWeekDates() {
        let now = new Date();
        let dayOfWeek = now.getDay(); // 0-6 where 0 is Sunday
        let numDay = now.getDate();
    
        let start = new Date(now); //copy
        start.setDate(numDay - ((dayOfWeek + 6) % 7));
        start.setHours(0, 0, 0, 0);
    
        let dates = [];
        for (let i = 0; i < 7; i++) {
            let newDate = new Date(start);
            newDate.setDate(newDate.getDate() + i);
            dates.push(convertDate(newDate));
        }
        return dates;
    }

    function convertDate(date){
        return date.getFullYear().toString() + addLeadingZero(date.getMonth() + 1) + addLeadingZero(date.getDate());
    }
    function addLeadingZero(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number.toString();
        }
    }

    return {
        getTodayDate,
        getWeekDates,
    }
}

function screenUpdater(){
    /*  addData(title, description, priority, date)
        removeData(id)
        sortData() 
    */
    const _storageUpdater = localStorageUpdater();
    /*  getTodayDate()
        getWeekDates()
    */
    const _dateHandler = dateHandler();
    const mainElement = document.querySelector('#todos');
    const todoModal = document.querySelector("#todoModal");
    const addPlusButton = document.querySelector("#addPlus");
    const todoForm = document.querySelector("#todoForm");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const date = document.querySelector("#date");

    addPlusButton.addEventListener("click", () => {
        title.value = "";
        description.value = "";
        date.value = "";
        todoModal.showModal();
    });

    todoForm.addEventListener("submit", () => {
        const dateNumber = Number(date.value.split('-').join(''));
        _storageUpdater.addData(title.value, description.value, 1, dateNumber);
        updateContainer();
    })

    
    function updateContainer(){
        // Clear the site
        mainElement.textContent = "";
        const dataArray = _storageUpdater.sortData();
        if (!dataArray?.length) return;
        dataArray.forEach(todo => {
            // Create todoDiv
            const todoDiv = createTodoDiv(todo);
            // Add todoDiv to mainElement
            mainElement.appendChild(todoDiv);
        });
    }

    function createTodoDiv(todo) {
        const id = todo.id;
        const todoDiv = document.createElement("div");
        const titleP = document.createElement("p");
        const dateP = document.createElement("p");
        const checkButton = document.createElement("button");
        const closeButton = document.createElement("button");
    
        todoDiv.classList.add("todo");
        todoDiv.classList.add(`priority${todo.priority}`);
        todoDiv.id = `todo${id}`;
        todoDiv.addEventListener("mouseenter", () => {
            closeButton.classList.add("hover");
        })
        todoDiv.addEventListener("mouseleave", () => {
            closeButton.classList.remove("hover");
        })
        
        titleP.classList.add("title");
        titleP.textContent = `${todo.title}`;
    
        dateP.classList.add("date");
        dateP.textContent = formatDate(todo.date.toString());
    
        checkButton.classList.add("checkButton");
        if (todo.checked) {
            checkButton.classList.add("active");
        } else checkButton.classList.remove("active");

        checkButton.addEventListener("click", () => {
            _storageUpdater.toggleChecked(id);
            updateContainer();
        });

        closeButton.classList.add("closeButton");
        closeButton.textContent = "X";
        closeButton.addEventListener("click", () => {
            _storageUpdater.removeData(id);
            updateContainer();
        });
        
        todoDiv.appendChild(checkButton);
        todoDiv.appendChild(closeButton);
        todoDiv.appendChild(titleP);
        todoDiv.appendChild(dateP);
    
        return todoDiv;
    }

    function formatDate(dateString) {
        let year = dateString.slice(0, 4);
        let month = dateString.slice(4, 6);
        let day = dateString.slice(6, 8);
    
        return `${year}/${month}/${day}`;
    }
    


}
screenUpdater();




