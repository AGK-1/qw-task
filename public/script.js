document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    if (!modal || !yesBtn || !noBtn) return; 

    let formToSubmit = null;

    
    document.querySelectorAll('.deleteButton').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.projectId;
            formToSubmit = document.getElementById(`deleteForm-${projectId}`);
            if (formToSubmit) modal.style.display = 'flex';
        });
    });

  
    noBtn.onclick = () => {
        modal.style.display = 'none';
        formToSubmit = null;
    };

 
    yesBtn.onclick = () => {
        if (formToSubmit) {
            formToSubmit.submit();
            modal.style.display = 'none';
            formToSubmit = null;
        }
    };

   
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            formToSubmit = null;
        }
    };
});