*** TESTES ***

 - Com TDD, podemos começar com teste de interação - Branas
 - teste de unidade -> rápido, pouca alteração, teste 1 método ou 1 classe
 - teste de integração -> acessa coisas externas, mais lento que a unidade (um mock não torna o teste de unidade)
 - teste de integração -> muito pesado, testa todo o sistema desde o front até o banco, muita alteração (principalmente no front)
 100% de cobertura na unidade, não garante confiabiliade no sistema, a integração pode não funcionar 

 E2E  -> lento e caro
  |
  v
INTEGRATION -> reúne o maior custo benefício (não é muito lento como o teste e2e e garente o funcionamento do sistema) - ele é sensível ao ambiente (se deletar as tabelas, ele quebra)
  |
  v
 UNIT   -> rápido, baixo custo

TESTE DEVE SER FIRST - Fast(rodar rápido) , Independent(isolados), Repeatable(sempre msm result), Self-validaitng(as respostas do teste que validam o teste, não um console log), Timily (antes do fonte)


*** ARQUITETURA HEXAGONAL / PORTS AND ADAPTERS (a mesma coisa os 2) ***

* DESIGN -> é um arranjo de responsabilidades - atribuição de responsabilidades - no código, é onde fica o que

* ARQUITETURA -> escolha de linguagem, tipo de banco de dados (tem a ver com o resultado q vc quer ter), a equipe, o deploy, são decisões

DAO - Data Access Object


*** TEST PATTERNS ***

 * Dummy -> código exige q passe parametro, mas não se usa, se n passar, quebra
 * Stubs -> objetos q retornam respostas prontas (método para pegar a contação do dólar ), passo por cima de um comportamento
 * Spy -> espiona se algo realmente aconteceu (monitoramento)
 * Mock -> mock faz spy e stub ao msm tempo (programo um comportamento e verifico)
 * Fake -> simula um comportamento real, seria usar o DAOMemory


*** SOLID ***

 * Single Responsability Principle (S) -> 


*** CLEAN ARCHITECTURE ***

 toda clean arch é uma implementação de hexagonal, mas nem toda hexagonal é uma implementação de clean arch

 a multa pode vir junto com a conta atrasada 

 o q são regras ? - cpf válido? o nome é válido ? o email é válido? qnt é a tarifa de uma corrida ?

   * domínio anêmico -> transaction script ou domain model
    - transaction script -> um service chama o outro passando dados -> gera dependência circular
    - domain model -> 

  * use case -> orquestra as entidades e recursos externos
    -> cria contra
    -> verificar conta (envia email para validar)
    -> aceita corrida
    -> finaliza corrida

  * Entidade em clean arch -> regra de negócio independente (regras são as mesmas independente do contexto)
   - para fazer o cálculo do frete - com cep e o centro de dist (invoco o método que pega a distancia entre os 2 [de qlr lugar])
   - 


*** DDD  - domain driven design ***

* DOmain - sistema de escola (notas, frequência) , sistema de agendamento de consulta médica (esse é seu domínio)

  - a solução é outra coisa

- Objetos de Domínio

  - Entities (E) -> Abtraem regras independentes, podendo ter identidade e estado que muda ao longo do tempo 
    - Account -> accountId (faço update da placa do carro, do tipo de account)
    - Ride -> inicia corrida, atualiza pos no mapa, sempre mudo o estado da entidade

  - Value Objects (VO) -> também contém regras independentes -> representa o que era um primitivo e introduz um objeto para lidar com ele

    - mede, quantifica, tem um estado para manter (aí crio um objeto)

     + fly weight -> tenho 10 milhões de árvores, crio um cache de árvores e  pego a referência dele
    
    - exemplos - > Password, Coordinates, Color(rgb), Email

  - Aggregates -> 

  - Repositories -> 

*** Domain Service ***

 - realiza tarefas específicas do domínio (n cabe na entity nem no VO)

 - Exmplos: token generator, distance calculator 

 -
