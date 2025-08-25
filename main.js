// On sélectionne l'élément principal du calculateur
const calculator = document.querySelector('.calculator');
// On sélectionne le conteneur des boutons du calculateur
const keys= calculator.querySelector('.calculator-buttons');
// On sélectionne l'affichage du calculateur
const display = calculator.querySelector('.calculator-display');

// On ajoute un écouteur d'événement sur le conteneur des boutons
keys.addEventListener('click', e => {
    // On vérifie si l'élément cliqué est bien un bouton
    if (e.target.matches('button')) {
    // On récupère le bouton cliqué
    const key = e.target;

    // On récupère l'action associée au bouton (par exemple: add, subtract, etc.)
    const action = key.dataset.action;

    //on prend le contenu de la div display qui affiche les nombre
    const keyContent = key.textContent;

    //et on l'insere dans une variable
    const displayedNumber = display.textContent;
    
    //on récupère le type de bouton précédent
    const previousKeyType = calculator.dataset.previousKeyType;

    //pour retirer .is-depressed de tous les boutons
    Array.from(keys.parentNode.children).forEach(
        key => key.classList.remove('is-depressed'));

        const calculer = (n1, operator, n2) => {
            let result = '';
    
            if (operator === 'add') {
                //vu que n1 et n2 sont encore des string on les parse pour les transformer en float
                //et pouvoir faire des opérations avec
                result = parseFloat(n1) + parseFloat(n2);
            } else if (operator === 'subtract') {
                result = parseFloat(n1) - parseFloat(n2);
            } else if (operator === 'multiply') {
                result = parseFloat(n1) * parseFloat(n2);
            } else if (operator === 'divide') {
                result = parseFloat(n1) / parseFloat(n2);
            }   
            return result;
        }

    
    // Si aucune action n'est définie, c'est une touche numérique
    if (!action) {
        //si le calculateur affiche 0 ou si le bouton précédent était un opérateur on remplace 0 par le contenu du bouton
        if(displayedNumber === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate'){
            display.textContent = keyContent;
        }else{
            //sinon on rajoute un nombre au nombre déja présent par concaténation
            display.textContent = displayedNumber + keyContent;
        }
        calculator.dataset.previousKeyType = "number";
    }

    // Si l'action correspond à un opérateur, on affiche "operator key"
    if (action === 'add'
        || action === 'subtract'
        || action === 'multiply'
        || action === 'divide'
    ) { 
        const firstValue = calculator.dataset.firstValue;
        const operator = calculator.dataset.operator;
        const secondValue = displayedNumber;

        //si on a déja cliqué sur la premiere valeure et que l'opérateur est défini
        //il suffit de choisir la 2e valeur puis appuyer sur l'operateur pour faire le calcul
        //pour éviter un bug sur les chiffres négatifs si avant la première valeure on a cliqué sur un opérateur
        //on ne fait aucun calcul
        if(firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate'){    
            const calcValue = calculer(firstValue, operator, secondValue);
            display.textContent = calcValue;
            
            //si une operation est faite on remplace son résultat par la premiere valeure
            //afin qu'on puisse faire des calculs succéssifs
            calculator.dataset.firstValue = calcValue;           
        }else{
            //si y a aucun calcul, la premiere valeur devient celle affichée
            calculator.dataset.firstValue = displayedNumber;
        }

        //si un opérateur est cliqué on ajoute la classe .is-depressed a sa div
        key.classList.add('is-depressed');
        //on crée un attribut custom qui nous servira a stocker quel bouton on a cliqué dessus
        //avant celui choisi pour savoir si c'est un opérateur ou un nombre
        calculator.dataset.previousKeyType = "operator";

        //on crée un attribut custom qui nous servira a stocker le premier chiffre affiche
        //avant qu'on ne le remplace par l'opérateur
       calculator.dataset.firstValue = displayedNumber;

       //on fait pareil pour l'opérateur choisi
       calculator.dataset.operator = action;
    }
        
    //si le bouton decimal est cliqué on vérifie si le nombre affiché contient une virgule
    //et si c'est le cas on l'ajoute à la fin
    if (action === 'decimal') {
        if(displayedNumber.includes(',')){
            display.textContent = displayedNumber + ',';
        //si la touche decimal est cliqué et que le bouton précédent était un opérateur on ajoute un 0,
        }else if(previousKeyType === 'operator' || previousKeyType === 'calculate'){    
            display.textContent = '0,';
        }
        calculator.dataset.previousKeyType = "decimal";
    }

    //si on clique n'importe quel bouton sauf clear on change le AC en CE
    if (action !== 'clear') {
        const clearButton = document.querySelector('[data-action="clear"]');
        clearButton.textContent = 'CE';
    }

    //si on clique sur le bouton clear apres on remet le texte du bouton a AC
    //et on remet les valeurs de calcul à zéro 
    if(action === 'clear'){
        if(key.textContent === 'AC'){
            calculator.dataset.firstValue = '';
            calculator.dataset.operator = '';
            calculator.dataset.modValue = '';
            calculator.dataset.previousKeyType = '';
        }else{
            key.textContent = 'AC';
        }

        display.textContent = '0';
        calculator.dataset.previousKeyType = "clear";
    }


    // Si l'action est "calculate", on affiche "equal key"
    if (action === 'calculate') {
       //quand on clique sur le bouton calculate on a que le le second chiffre affiché
       //donc on le récupere et le stocke dans une variable
       let secondValue = displayedNumber;

       //on récupère l'opérateur et on le stocke dans une variable
       const operator = calculator.dataset.operator;

       //on récupère le premier chiffre affiché et on le stocke dans une variable
       let firstValue = calculator.dataset.firstValue;

       //on créé une fonction 'calculer' qui fera le calcul et le résultat sera affiché
       if(firstValue){
           if(previousKeyType === 'calculate'){
               //si on a déja fait un operation en cliquant sur le bouton égal la réponse
               //devient le premier chiffre qui sera affiché
               //on récupère le second chiffre affiché et on le stocke dans la variable modValue pour continuer l'operation a l'infini
               firstValue = displayedNumber;
               secondValue = calculator.dataset.modValue;
           }

           display.textContent = calculer(firstValue, operator, secondValue);
        }

        //on stocke le second chiffre affiché dans la variable modValue
        calculator.dataset.modValue = secondValue;
        calculator.dataset.previousKeyType = "calculate";
    }
        
}

    
});

