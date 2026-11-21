<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user/index';
import { logoutUser } from '~/services/auth';
import { getPersonalTeam } from '~/services/personal';
import type { PersonalStudentMock } from '~/states/mockPersonalStudents';
import type { PersonalNavKey } from '~/components/personal/PersonalSidebar/index.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userName = computed(() => {
  const param = route.params.userName;
  return (Array.isArray(param) ? param[0] : param) || 'Personal';
});

const activeNav = ref<PersonalNavKey>('students');
const searchQuery = ref('');
const isLoading = ref(false);
const students = ref<PersonalStudentMock[]>([]);

const filteredStudents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return students.value;
  }

  return students.value.filter(
    (student) =>
      student.name.toLowerCase().includes(query) ||
      student.userName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
  );
});

async function fetchTeam() {
  isLoading.value = true;
  try {
    const response = await getPersonalTeam();
    students.value = (response.data || []).map((member) => ({
      id: member.id,
      name: member.name || member.user.userName,
      userName: member.user.userName,
      email: member.user.email,
      workoutsCount: member.workouts?.length ?? 0,
    }));
  } catch (err) {
    console.error('Error fetching personal team:', err);
    students.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchTeam();
});

async function logout() {
  try {
    await logoutUser();
  } catch (err) {
    console.error('Error during logout:', err);
  } finally {
    userStore.clearUser();
    const userNameCookie = useCookie<string | null>('userName');
    userNameCookie.value = null;
    router.push('/auth/signIn');
  }
}
</script>

<template>
  <div class="flex px-5 py-6 md:py-10 min-h-screen items-center flex-col gap-6">
    <PersonalSidebar
      :userName="userName"
      :activeItem="activeNav"
      @select="(key: PersonalNavKey) => (activeNav = key)"
      @logout="logout"
    />

    <main class="flex-1 flex flex-col w-full max-w-admin mx-auto gap-6">
      <PersonalHeader
        v-model="searchQuery"
        :userName="userName"
        :studentsCount="students.length"
      />

      <PersonalStudentsList
        :students="filteredStudents"
        :totalCount="students.length"
        :searchQuery="searchQuery"
        :isLoading="isLoading"
        @clearSearch="searchQuery = ''"
      />
    </main>
  </div>
</template>
