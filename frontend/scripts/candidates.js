// TODO: Получить кандидатов через гет запрос, отрисовать их в таблице, обработать кнопку добавления кандидата
const API_URL = "http://127.0.0.1:8000/candidates/"

window.addEventListener("DOMContentLoaded", () => {
    loadCandidates()
});


async function loadCandidates(){
    try{
        const response = await fetch(API_URL);

        if (!response.ok){
            alert("Ошибка загрузки кандидатов!")
            return
        }

        const candidates = await(response.json())
        const tbody = document.querySelector('#candidatesTable tbody')
        tbody.innerHTML = '' // очищаем таблицу

        candidates.forEach(candidate => {
            console.log(candidate)
            tbody.appendChild(createRow(candidate));
        });

    }catch (error){
        alert('Нет подключения к серверу !!!')
    }
}



// Создать строку таблицы для одного кандидата
function createRow(candidate){
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${candidate.id}</td>
        <td>${candidate.name}</td>
        <td>${candidate.experience}</td>
        <td>${candidate.education}</td>
        <td>${candidate.skills}</td>
        <td>${candidate.desired_salary}</td>
        <td>${candidate.can_relocate ? 'Да' : 'Нет'}</td>
        <td><button class="edit-btn">Изменить</button></td>
        <td><button class="delete-btn">Удалить</button></td>
    `

    // Удаление кандидата по кнопке
    tr.querySelector('.delete-btn').addEventListener('click', ()=>{
        deleteCandidate(candidate.id);    
    });

    // Изменение кандидата по кнопке
    tr.querySelector('.edit-btn').addEventListener('click', ()=>{
        alert("Еще не готово!")
    });

    return tr
}


async function deleteCandidate(candidateId){
    if (!confirm(`Удалить кандидата ${candidateId}?`)) return

    try{
        await fetch(`${API_URL}${candidateId}`, {method: 'DELETE'})
        loadCandidates()
        alert('Кандидат успешно удалён!')
    }catch{
        alert('Ошибка удаления кандидата!')
    }
}