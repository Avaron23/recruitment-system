

function add_candidate() {
    // Получаем таблицу
    var table = document.getElementById('candidatesTable');
    
    // Вставляем новую строку в конец ( -1 = в конец)
    var newRow = table.insertRow(-1);
    
    // Вставляем ячейки и заполняем их
    var cellId = newRow.insertCell(0);
    var cellName = newRow.insertCell(1);
    var cellExp = newRow.insertCell(2);
    var cellEdu = newRow.insertCell(3);
    var cellSkills = newRow.insertCell(4);
    var cellSalary = newRow.insertCell(5);
    var cellRelocate = newRow.insertCell(6);
    var cellEdit = newRow.insertCell(7);
    var cellDelete = newRow.insertCell(8);
    
    // Заполняем ячейки (временные значения)
    cellId.innerHTML = 'Example'
    cellName.innerHTML = 'asad' 
    cellExp.innerHTML = 3
    cellEdu.innerHTML = 'wqe'
    cellSkills.innerHTML = 'qweq'
    cellSalary.innerHTML = 33333
    cellRelocate.innerHTML = true
    cellEdit.innerHTML = 3
    cellDelete.innerHTML = 3 
}