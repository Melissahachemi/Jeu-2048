const grille = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
console.log(grille);
let score = 0;
let nbVide = 16;
console.log(score);
console.log(nbVide);
let jeuEnCours = true; // Variable pour contrôler si le jeu est en cours

function construitGrille() {
    const grilleDiv = document.getElementById("grille");
    let tableHTML = "<table>";
    for (let i = 0; i < 4; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < 4; j++) {
            const val = grille[i][j];
            const classe = val ? `tuile-${val} apparition` : "";
            tableHTML += `<td class="${classe}">${val === 0 ? "" : val}</td>`;
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    grilleDiv.innerHTML = tableHTML;
}


function afficheScore() {
    document.getElementById("score").innerHTML = `${score}`;
    console.log("Score affiché:", score);
}

function caseVide(i, x) {
    if (i < nbVide) {
        let compteur = 0;
        for (let j = 0; j < 4; j++) {
            for (let z = 0; z < 4; z++) {
                if (grille[j][z] === 0) {
                    if (compteur === i) {
                        grille[j][z] = x;
                        nbVide--;
                        console.log(`Case vide ${i} remplie avec ${x} à [${j}][${z}]`);
                        return true; // Indiquer le succès
                    }
                    compteur++;
                }
            }
        }
        console.error("Erreur: Logique interne de caseVide incorrecte.");
        return false; // Indiquer l'échec
    } else {
        console.error("Erreur: L'indice i demandé (" + i + ") est supérieur ou égal au nombre de cases vides (" + nbVide + ").");
        return false; // Indiquer l'échec
    }
}

function nouvelle() {
    score = 0;
    afficheScore();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            grille[i][j] = 0;
        }
    }
    nbVide = 16;
    // Placer l'entier 2 dans deux cases vides aléatoires
    let premiereCase = Math.floor(Math.random() * nbVide);
    caseVide(premiereCase, 2);
    let deuxiemeCase;
    do {
        deuxiemeCase = Math.floor(Math.random() * nbVide);
    } while (deuxiemeCase === premiereCase); // S'assurer que les deux cases sont différentes
    caseVide(deuxiemeCase, 2);
    // Afficher la grille
    construitGrille();
    console.log("Nouvelle partie démarrée");
    jeuEnCours = true; // Réinitialiser l'état du jeu
}

function glisse(direction) {
    if (!jeuEnCours) return; // Empêcher les mouvements si le jeu est fini

    let mouvement = false; // Variable pour vérifier s'il y a eu un mouvement

    if (direction === 'g') {
        for (let i = 0; i < 4; i++) {
            let ligne = grille[i];
            let nouvelleLigne = [0, 0, 0, 0];
            let fusionne = [false, false, false, false];
            let index = 0;
    
            for (let j = 0; j < 4; j++) {
                if (ligne[j] !== 0) {
                    if (
                        index > 0 &&
                        nouvelleLigne[index - 1] === ligne[j] &&
                        !fusionne[index - 1]
                    ) {
                        nouvelleLigne[index - 1] *= 2;
                        score += nouvelleLigne[index - 1];
                        fusionne[index - 1] = true;
                        nbVide++; // Une case de moins remplie car fusion
                        mouvement = true;
                    } else {
                        if (ligne[j] !== nouvelleLigne[index]) {
                            mouvement = true;
                        }
                        nouvelleLigne[index] = ligne[j];
                        index++;
                    }
                }
            }
    
            grille[i] = nouvelleLigne;
        }
    } else if (direction === 'd') {
        for (let i = 0; i < 4; i++) {
            grille[i].reverse();
        }
        mouvement = glisse('g') || mouvement; // Si glisse('g') retourne true, mouvement devient true
        for (let i = 0; i < 4; i++) {
            grille[i].reverse();
        }
    } else if (direction === 'h') {
        transposeGrille(grille); // Appel à transposeGrille pour modifier directement grille
        mouvement = glisse('g') || mouvement;
        transposeGrille(grille); // Appel à transposeGrille pour modifier directement grille
    } else if (direction === 'b') {
        transposeGrille(grille); // Appel à transposeGrille pour modifier directement grille
        for (let i = 0; i < 4; i++) {
            grille[i].reverse();
        }
        mouvement = glisse('g') || mouvement;
        for (let i = 0; i < 4; i++) {
            grille[i].reverse();
        }
        transposeGrille(grille); // Appel à transposeGrille pour modifier directement grille
    }
    if (mouvement) {
        ajouteNouvelleTuile();
    }

    construitGrille();
    afficheScore();

    if (estPartieFinie()) {
        gameOver();
        jeuEnCours = false;
    }

    return mouvement; // Retourne si un mouvement a eu lieu
}

function transposeGrille(grille) {
    for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) { // Notez le j = i + 1 pour éviter de transposer deux fois
            let temp = grille[i][j];
            grille[i][j] = grille[j][i];
            grille[j][i] = temp;
        }
    }
}

function ajouteNouvelleTuile() {
    if (nbVide > 0) {
        let index = Math.floor(Math.random() * nbVide);
        caseVide(index, 2);
    }
}

function gameOver() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent += " Game Over";
}

function estPartieFinie() {
    if (nbVide > 0) {
        return false;
    }

    // Vérifie s'il y a des mouvements possibles
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let val = grille[i][j];
            if ((i < 3 && grille[i + 1][j] === val) || (j < 3 && grille[i][j + 1] === val)) {
                return false; // Une fusion est possible
            }
        }
    }

    return true; // Aucun mouvement possible
}
document.addEventListener("DOMContentLoaded", nouvelle);
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector("button");
    console.log(btn);
    
    if (btn) {
        btn.addEventListener('click', nouvelle);
        console.log("Bouton 'Nouvelle partie' associé.");
    } else {
        console.error("Le bouton 'Nouvelle partie' n'a pas été trouvé.");
    }

    // Gestion des touches fléchées
    document.addEventListener('keydown', (event) => {
        if (jeuEnCours) {
            let direction = '';
            switch (event.which || event.keyCode) { // Compatibilité navigateur
                case 37:
                    direction = 'g';
                    break;
                case 38:
                    direction = 'h';
                    console.log(event.which);
                    console.log(event.keyCode);
                    
                    
                    break;
                case 39:
                    direction = 'd';
                    break;
                case 40:
                    direction = 'b';
                    break;
            }

            if (direction) {
                glisse(direction);
            }
        }
    });
});