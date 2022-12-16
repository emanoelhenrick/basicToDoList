///// DEFINE UM OBJETO COM TODAS AS FUNCOES QUE SERAO USADAS ///////////////////
const Main = {

    tasks: [],

    ///// INICIADOR GERAL ////////////////////
    init: function(){
        // nesse caso, o This torna possivel a utilização de elementos filhos do "Main"
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    ///// SELECIONA OS ELEMENTOS DO HTML E OS ARMAZENA NUMA VARIAVEL ///////////////////
    cacheSelectors: function(){

        // nesse caso, o This cria a variavel e a disponibiliza para todos os elementos dentro do pai da funcao(Main):
        // uma boa pratica é usar o cifrão($) em variaveis que armazenem elementos HTML
        this.$checkButtons = document.querySelectorAll('.check') //seleciona todos os elementos de classe ".check" e os coloca numa Array($checkButtons)

        this.$inputTask = document.querySelector('#inputTask')

        this.$list = document.querySelector('#list')

        this.$removeButtons = document.querySelectorAll('.remove')
    },

    ///// APLICA AS FUNCOES DE CADA EVENTO NOS ELEMENTOS HTML ///////////////////
    bindEvents: function(){
      
        const self = this // define o contexto do This fora do forEach para a variavel self, podendo ser reutilizada dentro de blocos onde o contexto do This seja diferente

        this.$checkButtons.forEach(function(button){//button representa cada elemento do Array
            button.onclick = self.Events.checkButton_click
        }) //percorre todos os elementos do Array checkButtons e caso clicado, aplica a funcao do evento no elemento button


        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this) // o bind this serve para linkar o contexto do This em que se encontra para dentro da função do evento

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
        })

        
    },


    ///// SELECIONA OS DADOS GRAVADOS NO LOCALSTORAGE E OS GUARDA EM UM ARRAY ///////////////////
    getStoraged: function(){
        const tasks = localStorage.getItem('tasks')

        // o this.tasks se refere ao array no inicio do objeto Main
        this.tasks = JSON.parse(tasks) // converte de JSON para objeto e adiciona numa array
    },

    getTaskHtml: function(task){
        return `
            <li>
                <div class="check"></div>
                    <label class="task">
                        ${task} 
                    </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `

    },

    ///// SELECIONA OS DADOS GRAVADOS NO LOCALSTORAGE E OS GUARDA EM UM ARRAY ///////////////////
    buildTasks: function(){
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html // insere no HTML as Lis com os valores guardados na array this.tasks

        this.cacheSelectors()
        this.bindEvents()
    },

    ///// PEGA AS TAREFAS GUARDADAS E MOSTRA NA TELA ///////////////////
    Events: {
        checkButton_click: function(e){ // funcao do evento de click no check
            
            const li = e.target.parentElement; // define em uma variavel a li do HTML com base no parentElement que o evento de click retorna no botao de check
           
            const isDone = li.classList.contains('done') // define em uma variavel o valor booleano(true ou false) caso contenha ou não a classe referida no elemento HTML

            if(!isDone){ // a exclamação é usada para verificar se o valor é negativo
                
                return li.classList.add('done') // retorna a adição da classe no elemento li e o return tbm para a função sem executar comandos posteriores
            }
            li.classList.remove('done') // remove a classe caso a condição acima não seja executada           
        },

        inputTask_keypress: function(e){ // funcao do evento de Enter no input de texto
            const key = e.key // seleciona qual tecla foi pressionada
            const value = e.target.value // seleciona o valor digitado no input

            if(key === 'Enter'){ // se a tecla for Enter, adiciona uma Li nova com o Value digitado
                this.$list.innerHTML += this.getTaskHtml(value)

                e.target.value = '' // limpa o campo de imput após add a Li

                this.cacheSelectors()
                this.bindEvents() // executa alguns comandos apos o html atualizar

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                const obj = [
                    { task: value},
                    ...savedTasksObj,
                ]

                localStorage.setItem('tasks', JSON.stringify(obj))
            }            
        },

        removeButton_click: function(e){ // funcao do evento de click no delete task
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTasksState = this.tasks.filter(item => item.task !== value)

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            console.log(newTasksState);

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
        }
    }
}

Main.init()