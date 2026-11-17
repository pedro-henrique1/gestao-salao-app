# Gestão de Salão — Flutter

Aplicativo móvel integrado ao frontend React e à mesma API NestJS. Ele adapta a experiência para dois públicos:

- **Cliente:** consulta o catálogo, escolhe profissional e horário, solicita agendamento e acompanha seus agendamentos.
- **Equipe:** acessa a operação do salão, incluindo dashboard, clientes, profissionais, serviços, agendamentos e caixa.

O perfil é identificado pelo campo `nivelAcesso` do JWT. Contas de cliente são criadas pelo cadastro do próprio aplicativo com nome e telefone; contas existentes de gerente e funcionário continuam compatíveis.

## Estrutura

- `lib/core/`: cliente HTTP e tema global.
- `lib/widgets/`: componentes reutilizáveis, como estados vazio/erro e cartões de métricas.
- `lib/screens/`: telas do aplicativo, separadas por fluxo.
- `lib/screens/client_home_shell.dart` e `client_home_screen.dart`: navegação e jornada específica do cliente.
- `lib/main.dart`: inicialização do app, preferências e roteamento inicial.

## Executar

```bash
cd flutter_app
flutter pub get
flutter run
```

A API local é configurada por `API_URL`. O valor padrão é `http://10.0.2.2:3000`, adequado ao emulador Android. Para iOS simulator ou web:

```bash
flutter run --dart-define=API_URL=http://localhost:3000
```

Em um dispositivo Android físico conectado por USB, a forma mais simples é criar um
encaminhamento da porta e usar `127.0.0.1`:

```bash
adb reverse tcp:3000 tcp:3000
flutter run --dart-define=API_URL=http://127.0.0.1:3000
```

Alternativamente, com celular e computador na mesma rede Wi-Fi, use o IP da máquina
que executa a API:

```bash
flutter run --dart-define=API_URL=http://192.168.100.148:3000
```

## Dados para demonstração

Para criar dados reais de apresentação no banco local:

```bash
cd api
npx prisma migrate deploy
```

Contas criadas pela migration `seed_demo_data`:

- Gerente: `gerente.demo@salao.local` / `Gerente@123`
- Funcionário: `funcionario.demo@salao.local` / `Funcionario@123`
- Cliente: `cliente.demo@salao.local` / `Cliente@123`

Os dados incluem serviços, profissionais, histórico de atendimentos e pagamentos,
além de agendamentos futuros para testar a jornada do cliente no aplicativo.
