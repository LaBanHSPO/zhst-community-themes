export interface Leader {
	rank: string;
	name: string;
	role: string;
	initials: string;
	history: { yr: string; text: string }[];
	term: string;
}

/** Static stewardship of the chapter (Ban Thường vụ, nhiệm kỳ 2026–2031). */
export const leaders: Leader[] = [
	{
		rank: "CHỦ TỊCH",
		name: "Phạm Tuấn Vũ",
		role: "Chủ tịch Hội",
		initials: "PV",
		term: "Nhiệm kỳ 2026–2031",
		history: [
			{ yr: "10/2026", text: "Uỷ viên Ban Thường vụ, Chủ tịch Hội Chữ thập đỏ xã Phú Lạc — nhiệm kỳ 2026–2031" },
			{ yr: "9/2026", text: "Uỷ viên Ban Chấp hành Hội Chữ thập đỏ xã Phú Lạc" },
		],
	},
	{
		rank: "PHÓ CHỦ TỊCH",
		name: "Nguyễn Công Tư",
		role: "Phó Chủ tịch Hội",
		initials: "NT",
		term: "Nhiệm kỳ 2026–2031",
		history: [{ yr: "—", text: "Thông tin chức vụ đang cập nhật" }],
	},
	{
		rank: "UỶ VIÊN BTV",
		name: "Hoàng Văn Quân",
		role: "Uỷ viên Ban Thường vụ",
		initials: "HQ",
		term: "Nhiệm kỳ 2026–2031",
		history: [
			{ yr: "2019–2024", text: "Trưởng Ban Truyền thông" },
			{ yr: "2014–2019", text: "Phó Chánh Văn phòng" },
			{ yr: "2010–2014", text: "Cán bộ Hội cấp tỉnh" },
		],
	},
	{
		rank: "UỶ VIÊN BTV",
		name: "Phạm Thu Hà",
		role: "Uỷ viên Ban Thường vụ",
		initials: "PH",
		term: "Nhiệm kỳ 2026–2031",
		history: [
			{ yr: "2020–2025", text: "Trưởng Ban Kiểm tra" },
			{ yr: "2015–2020", text: "Phó Trưởng Ban Tổ chức" },
			{ yr: "2011–2015", text: "Chuyên viên Hội cấp tỉnh" },
		],
	},
];
