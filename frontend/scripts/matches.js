const API_URL = "http://127.0.0.1:8000"
const MATCHES_API = API_URL + "/matches/"
const CANDIDATES_API = API_URL + "/candidates/"
const VACANCIES_API = API_URL + "/vacancies/"

let candidates = []
let vacancies = []
let matches = []

window.addEventListener("DOMContentLoaded", () => {
    loadCandidates()
    loadVacancies()
    loadMatches()
    setupMatchForm()
})

// Загрузить всех кандидатов
async function loadCandidates() {
    try {
        const response = await fetch(CANDIDATES_API)
        if (!response.ok) {
            alert("Ошибка загрузки кандидатов!")
            return
        }
        candidates = await response.json()
        populateCandidateSelect()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
    }
}

// Загрузить все вакансии
async function loadVacancies() {
    try {
        const response = await fetch(VACANCIES_API)
        if (!response.ok) {
            alert("Ошибка загрузки вакансий!")
            return
        }
        vacancies = await response.json()
        populateVacancySelect()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
    }
}

// Загрузить все мэтчи
async function loadMatches() {
    try {
        const response = await fetch(MATCHES_API)
        if (!response.ok) {
            alert("Ошибка загрузки мэтчей!")
            return
        }
        matches = await response.json()
        renderMatches()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
        renderMatches()
    }
}

// Заполнить селект кандидатов
function populateCandidateSelect() {
    const select = document.getElementById("formCandidate")
    const existingOptions = select.querySelectorAll("option")
    existingOptions.forEach((opt, index) => {
        if (index > 0) opt.remove()
    })

    candidates.forEach(candidate => {
        const option = document.createElement("option")
        option.value = candidate.id
        option.textContent = `${candidate.name} (опыт: ${candidate.experience} лет)`
        select.appendChild(option)
    })
}

// Заполнить селект вакансий
function populateVacancySelect() {
    const select = document.getElementById("formVacancy")
    const existingOptions = select.querySelectorAll("option")
    existingOptions.forEach((opt, index) => {
        if (index > 0) opt.remove()
    })

    vacancies.forEach(vacancy => {
        const option = document.createElement("option")
        option.value = vacancy.id
        option.textContent = `${vacancy.title}`
        select.appendChild(option)
    })
}

// Определить класс для скора
function getScoreClass(score) {
    if (score >= 70) return "high"
    if (score >= 40) return "medium"
    return "low"
}

// Отрисовать карточки мэтчей
function renderMatches() {
    const matchesList = document.getElementById("matchesList")
    matchesList.innerHTML = ""

    if (matches.length === 0) {
        matchesList.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p>📭 Мэтчей не найдено</p>
                <p style="font-size: 14px; color: #bdc3c7;">Создайте первый мэтч нажав кнопку выше</p>
            </div>
        `
        return
    }

    matches.forEach(match => {
        const candidate = candidates.find(c => c.id === match.candidate_id)
        const vacancy = vacancies.find(v => v.id === match.vacancy_id)

        if (!candidate || !vacancy) return

        const scoreClass = getScoreClass(match.total_score)
        const skillsHtml = match.matched_skills.length > 0
            ? match.matched_skills.map(skill => `<span class="skill-tag matched">${skill}</span>`).join("")
            : '<span style="color: #bdc3c7; font-size: 12px;">нет совпадений</span>'

        const card = document.createElement("div")
        card.className = "match-card"
        card.innerHTML = `
            <div class="match-card-header">
                <div class="match-info">
                    <h3>
                        <span class="candidate-name">${candidate.name}</span>
                        <br style="display: inline;">
                        → 
                        <span class="vacancy-title">${vacancy.title}</span>
                    </h3>
                </div>
                <div class="match-score">
                    <div class="score-value ${scoreClass}">${match.total_score}%</div>
                    <div class="score-label">Совпадение</div>
                </div>
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar ${scoreClass}" style="width: ${match.total_score}%"></div>
            </div>

            <div class="match-details">
                <div class="detail-row">
                    <span class="detail-label">Опыт кандидата:</span>
                    <span class="detail-value">${candidate.experience} лет</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Требуемый опыт:</span>
                    <span class="detail-value">${vacancy.required_experience} лет</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Образование кандидата:</span>
                    <span class="detail-value">${candidate.education.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Требуемое образование:</span>
                    <span class="detail-value">${vacancy.required_education.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Желаемая зарплата:</span>
                    <span class="detail-value">₽${candidate.desired_salary.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Предложение:</span>
                    <span class="detail-value">₽${vacancy.salary_offer.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Переезд:</span>
                    <span class="detail-value">${candidate.can_relocate ? '✅ Может' : '❌ Не может'} / ${vacancy.relocation_required ? '⚠️ Требуется' : '✅ Не требуется'}</span>
                </div>
            </div>

            <div class="skills-section">
                <div class="skills-label">Совпадённые навыки (${match.matched_skills.length} из ${vacancy.required_skills.length + vacancy.preferred_skills.length})</div>
                <div class="skills-tags">
                    ${skillsHtml}
                </div>
            </div>

            <div class="match-actions">
                <button class="btn-delete-match" onclick="deleteMatch(${match.candidate_id}, ${match.vacancy_id})">🗑️ Удалить</button>
            </div>
        `
        matchesList.appendChild(card)
    })
}

// Открыть форму создания матча
function openMatchForm() {
    document.getElementById("matchFormOverlay").style.display = "flex"
}

// Закрыть форму
function closeMatchForm() {
    document.getElementById("matchFormOverlay").style.display = "none"
    document.getElementById("formCandidate").value = ""
    document.getElementById("formVacancy").value = ""
}

// Настроить обработчики формы
function setupMatchForm() {
    document.getElementById("formCancel").addEventListener("click", closeMatchForm)

    document.getElementById("formSubmit").addEventListener("click", async () => {
        const candidateId = parseInt(document.getElementById("formCandidate").value)
        const vacancyId = parseInt(document.getElementById("formVacancy").value)

        if (!candidateId || !vacancyId) {
            alert("Выберите кандидата и вакансию!")
            return
        }

        // Проверить, существует ли уже такой мэтч
        const matchExists = matches.some(m => m.candidate_id === candidateId && m.vacancy_id === vacancyId)
        if (matchExists) {
            alert("Мэтч с этим кандидатом и вакансией уже существует!")
            return
        }

        try {
            const response = await fetch(MATCHES_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidate_id: candidateId,
                    vacancy_id: vacancyId
                })
            })

            if (!response.ok) {
                const error = await response.json()
                alert("Ошибка: " + (error.detail || "неизвестная ошибка"))
                return
            }

            closeMatchForm()
            loadMatches()
            alert("Мэтч успешно создан!")
        } catch (error) {
            alert("Не удалось создать мэтч!")
            console.error(error)
        }
    })
}

// Удалить мэтч
async function deleteMatch(candidateId, vacancyId) {
    if (!confirm("Вы уверены, что хотите удалить этот мэтч?")) return

    try {
        const response = await fetch(`${MATCHES_API}${candidateId}/${vacancyId}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            alert("Ошибка удаления мэтча!")
            return
        }

        loadMatches()
        alert("Мэтч успешно удалён!")
    } catch (error) {
        alert("Ошибка удаления мэтча!")
        console.error(error)
    }
}

// Удалить все мэтчи
async function deleteAllMatches() {
    if (!confirm("Вы уверены, что хотите удалить все мэтчи?")) return

    try {
        const response = await fetch(`${MATCHES_API}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            alert("Ошибка удаления мэтчей!")
            return
        }

        loadMatches()
        alert("Мэтчи успешно удалены!")
    } catch (error) {
        alert("Ошибка удаления мэтчей!")
        console.error(error)
    }
}

// Создать мэтчи по вакансии
async function createMatchesByVacancy() {
    const vacancy_id = parseInt(prompt("Введите айди вакансии(от 1 до ...)"))
    if (isNaN(vacancy_id) || vacancy_id < 1) {
        alert("Некорректный ID вакансии");
        return;
    }

    try {
        const response = await fetch(`${MATCHES_API}${vacancy_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
            const error = await response.json()
                alert("Ошибка: " + (error.detail || "неизвестная ошибка"))
            return
        }

        loadMatches()
        alert("Мэтчи успешно созданы!")
    } catch (error) {
        alert("Не удалось создать мэтчи!")
        console.error(error)
    }    
}

// Удалить мэтчи по вакансии
async function deleteMatchesByVacancy(){
    const vacancy_id = parseInt(prompt("Введите айди вакансии(от 1 до ...)"))
    if (isNaN(vacancy_id) || vacancy_id < 1) {
        alert("Некорректный ID вакансии");
        return;
    }

    try {
        const response = await fetch(`${MATCHES_API}${vacancy_id}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            alert("Ошибка удаления мэтчей!")
            return
        }

        loadMatches()
        alert("Мэтчи успешно удалены!")
    } catch (error) {
        alert("Ошибка удаления мэтчей!")
        console.error(error)
    }
}