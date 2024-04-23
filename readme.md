# Overview
This repo contains a utility webpage that compares between fonts by overlaying images of popular proprietary fonts with similar open source alternatives.

The definition of "similar" used for this project is "if the fonts are printed over each other, there is a high proportion of overlap."  This definition differs significantly from a listing of fonts that have a similar "feel", or have similar typographic features, which are the criteria used by most authors of "alternatives to \[font\]" lists online.  

The open source fonts included in the comparison are listed below.  All information in the sections below are personal notes/impressions, and should not be relied upon by others considering deploying these fonts.  Always double-check the applicable licenses yourself. "GPL" is used as shorthand for all GPL variants. 
# Fonts

## Arial

- `ua1r8a.woff` - URW Arial (URW A030)
	- Source: `urw-arial` Tex package
		- This may have been included in previous versions of Ghostscript, but does not appear to be included in the most recent version.
	- License: Aladdin Free Public License
	- Note: Converted from `.pfb` to `.woff` for web compatibility.
- See also:
	- URW Nimbus Sans
		- Listed as alternative to Helvetica, which is very similar to Arial.
## Bookman

- `URWBookman-Light.ttf` - URW Bookman Light
	- Source: Ghostscript Base 35 Fonts
	- License: GPL
- See also:
	- QT Bookmann
		- QT Bookmann appears to be identical to URW Bookman for common characters.
		- URW Bookman has more characters, however QT Bookmann has a permissive license (OFL), so may be useful in certain contexts.
## Calibri

- `Carlito-Regular.ttf` - Carlito
	- Source: Google Fonts
	- License: OFL
## Century Schoolbook

- `C059-Roman.ttf` - URW Schoolbook L (C059)
	- Source: Ghostscript Base 35 Fonts
	- License: GPL
## Courier New

- `NimbusMono-Regular.ttf` - Nimbus Mono
	- Source: Ghostscript Base 35 Fonts
	- License: GPL
## Garamond

- `EBGaramond-Regular.ttf` - EB Garamond
	- Source: Google Fonts
	- License: OFL
- `Garamond-Antiqua.ttf` - URW Garamond
	- Source: Ghostscript PCL5 Fonts
	- License: Aladdin Free Public License
- `QTGaromand.otf` - QT Garomand
	- Source: QualiType Font Collection
	- License: OFL
- See also:
	- Cormorant Garamond
		- This font is Garamond-like in style, however is not directly comparable to Garamond MT.
		- The "about" page sates this is intentional, as "\[the creator\] did not use any specific font as a starting point or direct reference".
## Helvetica

- `NimbusSans-Regular.ttf` - URW Nimbus Sans
	- Source: Ghostscript Base 35 Fonts
	- License: GPL
## Minion

- `CrimsonText-Regular.ttf` - Crimson Text
	- Source: Google Fonts
	- License: OFL
## Palatino

- `P052-Roman.ttf` - URW Palladio
	- Source: Ghostscript Base 35 Fonts
	- License: GPL
- See also:
	- QT Palatine
		- QT Palatine appears to be identical to URW Palladio for common characters, so is not included in the comparison.
		- QT Palatine is permissively licensed (OFL), so this font is worth considering if the license of URW Palladio is problematic.
## Times New Roman

- `NimbusRoman-Regular.ttf` - URW Nimbus Roman (No 9)
	- Source: Ghostscript Base 35 Fonts
	- License: GPL
## Veranda
Comparing optimized fonts to Veranda also applies to Tahoma.  The glyphs of Tahoma and Veranda only differ by simple geometric transformations.

- `tahoma.ttf` - Wine Tahoma
	- Source: Wine
	- License: GPL
# Licenses

- Aladdin Free Public License (AFPL)
	- Non-commercial, copy-left
- GNU Public License (GPL)
	- Copy-left
- Open Font License (OFL)
	- Permissive