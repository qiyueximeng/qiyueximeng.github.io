<template>
  <div class="about">
    <div class="name">幽涯</div>
    <div class="contacts">
      <!-- 补充 home/github icon 和跳转链接 -->
    </div>
    <section class="description">
      <!-- 重写个人介绍 -->
      <!-- <p>
        我是幽涯，是个前后端都会写一些的工程师，目前就职于字节跳动，除了编程以外，日常喜欢看数和玩游戏多一点。
      </p>
      <p>嗯，先介绍这么多，其他的想到了再补上...</p> -->
    </section>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .name {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .contacts {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin-bottom: 1rem;
  }
  .contact {
    padding: 0 0.5rem;
  }
  .description > p {
    color: #666; line-height: 1.2rem; margin-bottom: 0.5rem;
  }
}
</style>
