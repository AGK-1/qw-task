let selectedProjectId = null;

function openModal(id) {
    // alert(id);
    selectedProjectId = id;
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

const confirmBtn = document.getElementById("confirmBtn");
if (confirmBtn) {
    confirmBtn.onclick = function () {
        if (selectedProjectId !== null) {
            deleteProject(selectedProjectId);
        }
        closeModal();
    };
}

const confirmBtnForUpdate = document.getElementById("confirmBtnForUpdate");
if (confirmBtnForUpdate) {
    confirmBtnForUpdate.onclick = function () {
        if (selectedProjectId !== null) {
             deleteProjectFromUpdateProject(selectedProjectId);
        }

        closeModal();
    };
}


async function deleteProject(projectId) {
    try {
        const res = await fetch(`/projects/del/${projectId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            alert("It is impossible to delete someone else's project.");
            return;
        }
        await initProjects();
    } catch (err) {
        alert("Network error");
    }
}

async function deleteProjectFromUpdateProject(projectId) {
    try {
        const res = await fetch(`/projects/del/${projectId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            alert("It is impossible to delete someone else's project.");
            return;
        }
        alert("Deleted successfully");
        return window.location.href = "/projects";


        // await initProjects();
    } catch (err) {
        console.error("REAL ERROR:", err);

        alert("Network error");
    }
}