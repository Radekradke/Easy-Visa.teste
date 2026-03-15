// js/appointment.js

const booking = {}; // objeto que vai guardar tudo

// ========= ETAPA 1: ESCOLHER SERVIÇO =========
const serviceCards = document.querySelectorAll('.service-card');
const nextBtn = document.getElementById('next-btn');

// ao clicar em um card
serviceCards.forEach(card => {
  card.addEventListener('click', function() {
    // remove seleção anterior
    serviceCards.forEach(c => c.classList.remove('selected'));
    
    // marca o atual
    this.classList.add('selected');

    // salva a escolha
    booking.service = this.dataset.service;
    console.log('Serviço selecionado:', booking.service);

    // habilita o botão "Próximo"
    nextBtn.disabled = false;
  });
});

// ========= ETAPA 2: DATA E HORÁRIO =========
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const dateInput = document.getElementById('date');
const timeSlotsDiv = document.getElementById('time-slots');
const nextToStep3 = document.getElementById('next-to-step3');
const backToStep1 = document.getElementById('back-to-step1');

// Função pra exibir a Etapa 2
function goToStep2() {
  step1.classList.remove('active');
  step1.classList.add('hidden');
  step2.classList.remove('hidden');
  step2.classList.add('active');

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // define o mínimo do calendário (hoje)
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// Avançar da Etapa 1 pra 2
nextBtn.addEventListener('click', () => {
  if (!booking.service) {
    showNotification('Escolha um serviço antes de continuar.', 'warning');
    return;
  }
  goToStep2();
});

// Voltar pra Etapa 1
backToStep1.addEventListener('click', () => {
  step2.classList.remove('active');
  step2.classList.add('hidden');
  step1.classList.remove('hidden');
  step1.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Quando escolher uma data → mostra horários
dateInput.addEventListener('change', () => {
  const selectedDate = dateInput.value;
  booking.date = selectedDate;

  // horários disponíveis (exemplo fixo)
  const times = ["09:00", "11:00", "14:00", "16:00"];

  // limpa o container e recria botões
  timeSlotsDiv.innerHTML = '';
  times.forEach(time => {
    const btn = document.createElement('div');
    btn.classList.add('time-slot');
    btn.textContent = time;

    btn.addEventListener('click', function() {
      document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
      this.classList.add('selected');
      booking.time = time;
      nextToStep3.disabled = false;
      console.log('Horário selecionado:', booking.time);
    });

    timeSlotsDiv.appendChild(btn);
  });
});

// ========= ETAPA 3: DADOS PESSOAIS =========
const step3 = document.getElementById('step-3');
const backToStep2 = document.getElementById('back-to-step2');
const nextToStep4 = document.getElementById('next-to-step4');
const personalForm = document.getElementById('personal-data-form');

// Função para ir para a Etapa 3
function goToStep3() {
  step2.classList.remove('active');
  step2.classList.add('hidden');
  step3.classList.remove('hidden');
  step3.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Resetar o estado do botão quando entrar na etapa 3
  nextToStep4.disabled = true;
  
  // Verifica se já tem dados preenchidos
  setTimeout(() => {
    checkFormValidity();
  }, 100);
}

// Quando clicar em "Próximo" da Etapa 2
nextToStep3.addEventListener('click', () => {
  if (!booking.date || !booking.time) {
    showNotification('Selecione uma data e horário antes de continuar.', 'warning');
    return;
  }
  console.log('Avançando para Etapa 3 - Dados:', booking);
  goToStep3();
});

// Voltar pra Etapa 2
backToStep2.addEventListener('click', () => {
  step3.classList.remove('active');
  step3.classList.add('hidden');
  step2.classList.remove('hidden');
  step2.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Função de validação do formulário - APENAS 3 CAMPOS
function checkFormValidity() {
  const fullname = document.getElementById('fullname');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  
  if (!fullname || !phone || !email) {
    console.log('❌ Elementos do formulário não encontrados!');
    return false;
  }
  
  const fullnameValue = fullname.value.trim();
  const phoneValue = phone.value.trim();
  const emailValue = email.value.trim();
  
  const allFilled = fullnameValue !== '' && phoneValue !== '' && emailValue !== '';
  
  console.log('🔍 Verificando formulário:', {
    fullname: fullnameValue !== '' ? '✓ ' + fullnameValue : '✗ vazio',
    phone: phoneValue !== '' ? '✓ ' + phoneValue : '✗ vazio',
    email: emailValue !== '' ? '✓ ' + emailValue : '✗ vazio',
    allFilled: allFilled ? '✅ COMPLETO' : '❌ INCOMPLETO'
  });
  
  // Habilita/desabilita o botão
  if (nextToStep4) {
    nextToStep4.disabled = !allFilled;
    console.log('🔘 Botão nextToStep4 está agora:', nextToStep4.disabled ? 'DESABILITADO ❌' : 'HABILITADO ✅');
  }
  
  // Feedback visual nos inputs
  [fullname, phone, email].forEach(input => {
    if (input.value.trim() !== '') {
      input.style.borderColor = '#28a745';
    } else {
      input.style.borderColor = '#ddd';
    }
  });
  
  return allFilled;
}

// Adiciona listeners aos campos do formulário
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado, configurando listeners...');
  
  const fullname = document.getElementById('fullname');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  
  const inputs = [fullname, phone, email];
  
  console.log('📝 Inputs encontrados:', {
    fullname: !!fullname,
    phone: !!phone,
    email: !!email
  });
  
  inputs.forEach(input => {
    if (input) {
      // Múltiplos eventos para garantir captura
      input.addEventListener('input', () => {
        console.log(`⌨️ Input digitado em: ${input.id}`);
        checkFormValidity();
      });
      
      input.addEventListener('change', () => {
        console.log(`🔄 Change em: ${input.id}`);
        checkFormValidity();
      });
      
      input.addEventListener('keyup', () => {
        console.log(`⬆️ Keyup em: ${input.id}`);
        checkFormValidity();
      });
      
      input.addEventListener('blur', () => {
        console.log(`👁️ Blur em: ${input.id}`);
        checkFormValidity();
      });
    }
  });
});

// ========= ETAPA 4: REVISÃO E PAGAMENTO =========
const step4 = document.getElementById('step-4');
const backToStep3 = document.getElementById('back-to-step3');
const confirmAndPay = document.getElementById('confirm-and-pay');

// Função para ir à Etapa 4
function goToStep4() {
  console.log('🚀 Iniciando transição para Step 4');
  
  step3.classList.remove('active');
  step3.classList.add('hidden');
  step4.classList.remove('hidden');
  step4.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Preenche o resumo com as infos do booking
  document.getElementById('summary-service').textContent = booking.service || '—';
  document.getElementById('summary-date').textContent = booking.date || '—';
  document.getElementById('summary-time').textContent = booking.time || '—';
  document.getElementById('summary-name').textContent = booking.fullname || '—';
  document.getElementById('summary-phone').textContent = booking.phone || '—';
  document.getElementById('summary-email').textContent = booking.email || '—';

  console.log('✅ Step 4 ativo! Resumo exibido:', booking);
}

// Avançar para Etapa 4
if (nextToStep4) {
  nextToStep4.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔵 Botão nextToStep4 clicado!');
    
    // Coleta os dados
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    console.log('📝 Dados coletados:', { fullname, phone, email });

    // Validação básica
    if (!fullname || !phone || !email) {
      console.log('❌ Validação falhou: campos vazios');
      showNotification('Preencha todos os campos antes de continuar.', 'warning');
      return false;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email inválido');
      showNotification('Por favor, insira um email válido.', 'error');
      return false;
    }

    // Salva os dados
    booking.fullname = fullname;
    booking.phone = phone;
    booking.email = email;
    
    console.log('✅ Dados validados e salvos:', booking);
    console.log('➡️ Chamando goToStep4()...');

    // Vai para Step 4
    goToStep4();
    
    return false;
  });
}

// Voltar pra Etapa 3
if (backToStep3) {
  backToStep3.addEventListener('click', () => {
    step4.classList.remove('active');
    step4.classList.add('hidden');
    step3.classList.remove('hidden');
    step3.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Botão "Confirmar e Pagar"
if (confirmAndPay) {
  confirmAndPay.addEventListener('click', async (e) => {
    e.preventDefault();
    
    confirmAndPay.disabled = true;
    confirmAndPay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

    console.log('💳 Confirmando agendamento:', booking);

    // Simula processamento
    setTimeout(() => {
      console.log('✅ Redirecionando para confirmation.html');
      
      // Redireciona para página de confirmação
      window.location.href = 'confirmation.html';
    }, 1500);
  });
}

// ========= SISTEMA DE NOTIFICAÇÕES =========
function showNotification(message, type = 'info') {
  // Remove notificação anterior se existir
  const existing = document.querySelector('.notification-toast');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 20px 30px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#ffc107'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    animation: slideIn 0.5s ease;
    max-width: 400px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Adiciona animações de slide
const notifStyle = document.createElement('style');
notifStyle.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notifStyle);

// Debug inicial
console.log('✅ appointment.js carregado');
console.log('🔍 Elementos críticos:', {
  nextToStep4: nextToStep4 ? '✓ encontrado' : '✗ NÃO ENCONTRADO',
  step3: step3 ? '✓ encontrado' : '✗ NÃO ENCONTRADO',
  step4: step4 ? '✓ encontrado' : '✗ NÃO ENCONTRADO',
  personalForm: personalForm ? '✓ encontrado' : '✗ NÃO ENCONTRADO'
});