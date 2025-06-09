document.addEventListener('DOMContentLoaded', async () => {

    // =================================================================================
    // CONFIGURAÇÃO GLOBAL E NAVEGAÇÃO
    // =================================================================================
    const apiUrl = 'http://127.0.0.1:8000/api';

    const injetarNavegacao = () => {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) return;

        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        const links = [
            { href: 'home.html', text: 'Home' },
            { href: 'usuarios.html', text: 'Gerenciar Usuários' },
            { href: 'livros.html', text: 'Gerenciar Livros' },
            { href: 'emprestimos.html', text: 'Gerenciar Empréstimos' }
        ];

        const navHTML = `
            <nav class="bg-white p-4 rounded-lg shadow-md mb-8">
                <ul class="flex space-x-6">
                    ${links.map(link => `
                        <li>
                            <a href="${link.href}" class="${currentPage === link.href ? 'font-bold text-blue-600' : 'text-gray-700 hover:text-blue-600'}">
                                ${link.text}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
        `;
        navbarContainer.innerHTML = navHTML;
    };

    // =================================================================================
    // FUNÇÕES GENÉRICAS DA API
    // =================================================================================
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`${apiUrl}/${endpoint}`, {
                headers: { 'Accept': 'application/json' },
                cache: 'no-cache'
            });
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Falha ao buscar dados de ${endpoint}:`, error);
            Swal.fire({
                title: 'Erro de Conexão',
                text: `Não foi possível carregar os dados de ${endpoint}. Verifique se a API está rodando corretamente.`,
                icon: 'error'
            });
            return [];
        }
    };

    // =================================================================================
    // PÁGINA: GERENCIAR USUÁRIOS
    // =================================================================================
    const inicializarPaginaUsuarios = async () => {
        const secaoUsuarios = document.getElementById('secao-usuarios');
        if (!secaoUsuarios) return;

        const formularioUsuario = document.getElementById('formulario-usuario');
        const listaUsuarios = document.getElementById('lista-usuarios');
        const botaoCancelar = document.getElementById('botao-cancelar-edicao-usuario');
        const campoId = document.getElementById('usuarioId');
        const campoNome = document.getElementById('usuarioNome');
        const campoEmail = document.getElementById('usuarioEmail');
        const campoMatricula = document.getElementById('usuarioMatricula');

        let usuarios = [];

        const renderizarUsuarios = () => {
            listaUsuarios.innerHTML = '';
            if (usuarios.length === 0) {
                listaUsuarios.innerHTML = '<li>Nenhum usuário cadastrado.</li>';
                return;
            }
            usuarios.forEach(usuario => {
                const li = document.createElement('li');
                li.className = 'item-lista';
                li.innerHTML = `
                    <span>${usuario.nome} (${usuario.email}) - #${usuario.numero_cadastro}</span>
                    <div class="space-x-2">
                        <button onclick="editarUsuario(${usuario.id})" class="text-blue-500 hover:text-blue-700">Editar</button>
                        <button onclick="excluirUsuario(${usuario.id})" class="text-red-500 hover:text-red-700">Excluir</button>
                    </div>
                `;
                listaUsuarios.appendChild(li);
            });
        };

        const carregarUsuarios = async () => {
            usuarios = await fetchData('usuarios');
            renderizarUsuarios();
        };

        const resetarFormulario = () => {
            formularioUsuario.reset();
            campoId.value = '';
            botaoCancelar.classList.add('hidden');
        };

        formularioUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = campoId.value;
            const dados = {
                nome: campoNome.value,
                email: campoEmail.value,
                numero_cadastro: campoMatricula.value,
            };

            const url = id ? `${apiUrl}/usuarios/${id}` : `${apiUrl}/usuarios`;
            const method = id ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(dados),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao salvar usuário');
                }
                
                resetarFormulario();
                await carregarUsuarios();
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Usuário salvo com sucesso.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

            } catch (error) {
                Swal.fire({
                    title: 'Erro ao Salvar',
                    text: error.message,
                    icon: 'error'
                });
            }
        });

        botaoCancelar.addEventListener('click', resetarFormulario);
        
        window.editarUsuario = (id) => {
            const usuario = usuarios.find(u => u.id === id);
            if (usuario) {
                campoId.value = usuario.id;
                campoNome.value = usuario.nome;
                campoEmail.value = usuario.email;
                campoMatricula.value = usuario.numero_cadastro;
                botaoCancelar.classList.remove('hidden');
                formularioUsuario.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.excluirUsuario = async (id) => {
            const result = await Swal.fire({
                title: 'Tem certeza?',
                text: "Esta ação não pode ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${apiUrl}/usuarios/${id}`, { 
                        method: 'DELETE',
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.status === 204) {
                        await carregarUsuarios();
                        Swal.fire('Excluído!', 'O usuário foi excluído com sucesso.', 'success');
                    } else if (!response.ok) {
                       const errorData = await response.json();
                       throw new Error(errorData.message || 'Erro ao excluir usuário.');
                    }
                } catch (error) {
                    Swal.fire('Erro!', `Não foi possível excluir o usuário: ${error.message}`, 'error');
                }
            }
        };

        await carregarUsuarios();
    };

    // =================================================================================
    // PÁGINA: GERENCIAR LIVROS
    // =================================================================================
    const inicializarPaginaLivros = async () => {
        const secaoLivros = document.getElementById('secao-livros');
        if (!secaoLivros) return;
        
        const formularioLivro = document.getElementById('formulario-livro');
        const listaLivros = document.getElementById('lista-livros');
        const botaoCancelar = document.getElementById('botao-cancelar-edicao-livro');
        const campoId = document.getElementById('livroId');
        const campoNome = document.getElementById('livroNome');
        const campoAutor = document.getElementById('livroAutor');
        const campoGenero = document.getElementById('livroGenero');
        const campoRegistro = document.getElementById('livroRegistro');

        let livros = [];
        let generos = [];

        const popularSelectGeneros = () => {
            campoGenero.innerHTML = '<option value="">Selecione um gênero</option>';
            generos.forEach(genero => {
                campoGenero.add(new Option(genero.nome, genero.id));
            });
        };

        const carregarGeneros = async () => {
            generos = await fetchData('generos');
            popularSelectGeneros();
        };

        const renderizarLivros = () => {
            listaLivros.innerHTML = '';
            if(livros.length === 0) {
                listaLivros.innerHTML = '<li>Nenhum livro cadastrado.</li>';
                return;
            }
            livros.forEach(livro => {
                const classeStatus = livro.situacao === 'Disponível' ? 'status-disponivel' : 'status-emprestado';
                const li = document.createElement('li');
                li.className = 'item-lista';
                li.innerHTML = `
                    <div>
                        <span>${livro.nome} <span class="text-gray-500">por ${livro.autor}</span></span>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">${livro.genero?.nome || 'N/A'}</span>
                            <span class="status ${classeStatus}">${livro.situacao}</span>
                        </div>
                    </div>
                    <div class="space-x-2">
                        <button onclick="editarLivro(${livro.id})" class="text-blue-500 hover:text-blue-700">Editar</button>
                        <button onclick="excluirLivro(${livro.id})" class="text-red-500 hover:text-red-700">Excluir</button>
                    </div>
                `;
                listaLivros.appendChild(li);
            });
        };

        const carregarLivros = async () => {
            livros = await fetchData('livros');
            renderizarLivros();
        };

        const resetarFormularioLivro = () => {
            formularioLivro.reset();
            campoId.value = '';
            botaoCancelar.classList.add('hidden');
        };

        formularioLivro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = campoId.value;
            const dados = {
                nome: campoNome.value,
                autor: campoAutor.value,
                genero_id: campoGenero.value,
                numero_registro: campoRegistro.value,
            };

            const url = id ? `${apiUrl}/livros/${id}` : `${apiUrl}/livros`;
            const method = id ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(dados),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao salvar livro');
                }
                resetarFormularioLivro();
                await carregarLivros();
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Livro salvo com sucesso.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire('Erro!', `Não foi possível salvar o livro: ${error.message}`, 'error');
            }
        });

        botaoCancelar.addEventListener('click', resetarFormularioLivro);

        window.editarLivro = (id) => {
            const livro = livros.find(l => l.id === id);
            if (livro) {
                campoId.value = livro.id;
                campoNome.value = livro.nome;
                campoAutor.value = livro.autor;
                campoGenero.value = livro.genero_id;
                campoRegistro.value = livro.numero_registro;
                botaoCancelar.classList.remove('hidden');
                formularioLivro.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.excluirLivro = async (id) => {
            const result = await Swal.fire({
                title: 'Tem certeza?',
                text: "Esta ação não pode ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${apiUrl}/livros/${id}`, {
                        method: 'DELETE',
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.status === 204) {
                        await carregarLivros();
                        Swal.fire('Excluído!', 'O livro foi excluído com sucesso.', 'success');
                    } else if (!response.ok) {
                       const errorData = await response.json();
                       throw new Error(errorData.message || 'Erro ao excluir livro.');
                    }
                } catch (error) {
                    Swal.fire('Erro!', `Não foi possível excluir o livro: ${error.message}`, 'error');
                }
            }
        };

        await carregarGeneros();
        await carregarLivros();
    };

    // =================================================================================
    // PÁGINA: GERENCIAR EMPRÉSTIMOS
    // =================================================================================
    const inicializarPaginaEmprestimos = async () => {
        const formularioEmprestimo = document.getElementById('formulario-emprestimo');
        if (!formularioEmprestimo) return;

        const listaEmprestimos = document.getElementById('lista-emprestimos');
        const selectUsuario = document.getElementById('emprestimoUsuario');
        const selectLivro = document.getElementById('emprestimoLivro');
        const campoDataDevolucao = document.getElementById('dataDevolucao');

        let emprestimos = [];
        
        const renderizarEmprestimos = () => {
            listaEmprestimos.innerHTML = '';
            if(emprestimos.length === 0){
                listaEmprestimos.innerHTML = '<li>Nenhum empréstimo ativo ou no histórico.</li>';
                return;
            }
            emprestimos.sort((a, b) => new Date(b.data_emprestimo) - new Date(a.data_emprestimo));
            
            emprestimos.forEach(emprestimo => {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const dataDevolucao = new Date(emprestimo.data_devolucao + 'T03:00:00');
                let status = emprestimo.status;
                let classeStatus = '';

                if (status === 'Emprestado' && dataDevolucao < hoje) {
                    status = 'Atrasado';
                }
                
                switch(status) {
                    case 'Emprestado': classeStatus = 'status-emprestado'; break;
                    case 'Atrasado': classeStatus = 'status-atrasado'; break;
                    case 'Devolvido': classeStatus = 'status-devolvido'; break;
                }

                const li = document.createElement('li');
                li.className = 'item-lista flex-col items-start';
                li.innerHTML = `
                    <div class="w-full flex justify-between items-center">
                        <span><strong>Livro:</strong> ${emprestimo.livro?.nome || 'N/A'}</span>
                        <span class="status ${classeStatus}">${status}</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1 w-full">
                        <span><strong>Usuário:</strong> ${emprestimo.usuario?.nome || 'N/A'}</span><br>
                        <span><strong>Devolução até:</strong> ${dataDevolucao.toLocaleDateString('pt-BR')}</span>
                    </div>
                    ${emprestimo.status !== 'Devolvido' ? `
                    <div class="mt-2 w-full text-right">
                        <button onclick="devolverLivro(${emprestimo.id})" class="text-green-500 hover:text-green-700">Marcar como Devolvido</button>
                    </div>
                    ` : ''}
                `;
                listaEmprestimos.appendChild(li);
            });
        };

        const popularSelects = async () => {
            try {
                const [usuarios, livros] = await Promise.all([
                    fetchData('usuarios'),
                    fetchData('livros')
                ]);

                selectUsuario.innerHTML = '<option value="">Selecione um usuário</option>';
                usuarios.forEach(u => selectUsuario.add(new Option(u.nome, u.id)));

                selectLivro.innerHTML = '<option value="">Selecione um livro</option>';
                livros.filter(l => l.situacao === 'Disponível').forEach(l => selectLivro.add(new Option(l.nome, l.id)));
            } catch(error) {
                console.error("Erro ao popular selects:", error);
            }
        };

        const carregarEmprestimos = async () => {
            emprestimos = await fetchData('emprestimos');
            renderizarEmprestimos();
        };

        formularioEmprestimo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                usuario_id: selectUsuario.value,
                livro_id: selectLivro.value,
                data_devolucao: campoDataDevolucao.value,
            };

            if(!dados.usuario_id || !dados.livro_id || !dados.data_devolucao) {
                Swal.fire('Atenção!', "Por favor, preencha todos os campos para registrar o empréstimo.", 'warning');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/emprestimos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(dados),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao registrar empréstimo');
                }
                formularioEmprestimo.reset();
                await carregarEmprestimos();
                await popularSelects();
                Swal.fire('Sucesso!', 'Empréstimo registrado com sucesso.', 'success');
            } catch (error) {
                console.error('Erro ao registrar empréstimo:', error);
                Swal.fire('Erro!', `Não foi possível registrar o empréstimo: ${error.message}`, 'error');
            }
        });

        window.devolverLivro = async (id) => {
            const result = await Swal.fire({
                title: 'Confirmar Devolução',
                text: "Deseja marcar este livro como devolvido?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim, devolver',
                cancelButtonText: 'Cancelar'
            });

            if(result.isConfirmed) {
                try {
                    const response = await fetch(`${apiUrl}/emprestimos/${id}/devolver`, { 
                        method: 'PATCH',
                        headers: { 'Accept': 'application/json' }
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Erro ao devolver livro.');
                    }
                    await carregarEmprestimos();
                    await popularSelects();
                    Swal.fire('Devolvido!', 'O livro foi marcado como devolvido.', 'success');
                } catch (error) {
                    Swal.fire('Erro!', `Não foi possível devolver o livro: ${error.message}`, 'error');
                }
            }
        };

        await popularSelects();
        await carregarEmprestimos();
    };


    // =================================================================================
    // INICIALIZAÇÃO
    // =================================================================================
    injetarNavegacao();
    await inicializarPaginaUsuarios();
    await inicializarPaginaLivros();
    await inicializarPaginaEmprestimos();
});
