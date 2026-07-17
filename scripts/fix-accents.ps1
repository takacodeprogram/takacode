$replacements = @{
    'Decouvr'       = 'D�couvr'
    'decouvr'       = 'd�couvr'
    'Ecran'         = '�cran'
    'ecran'         = '�cran'
    'Etape'         = '�tape'
    'etape'         = '�tape'
    'Etapes'        = '�tapes'
    'etapes'        = '�tapes'
    'Complete'      = 'Compl�te'
    'complete'      = 'compl�te'
    'Creer'         = 'Cr�er'
    'creer'         = 'cr�er'
    'Cree\r'        = 'Cr��\r'
    'cree\r'        = 'cr��\r'
    'Cree '         = 'Cr�� '
    'cree '         = 'cr�� '
    'Decouvrir'     = 'D�couvrir'
    'decouvrir'     = 'd�couvrir'
    'Deroule'       = 'D�roule'
    'deroule'       = 'd�roule'
    'Deroulement'   = 'D�roulement'
    'deroulement'   = 'd�roulement'
    'Developp'      = 'D�velopp'
    'developp'      = 'd�velopp'
    'Demarre'       = 'D�marre'
    'demarre'       = 'd�marre'
    'Demarrer'      = 'D�marrer'
    'demarrer'      = 'd�marrer'
    'Numerique'     = 'Num�rique'
    'numerique'     = 'num�rique'
    'Securite'      = 'S�curit�'
    'securite'      = 's�curit�'
    'Pedagogique'   = 'P�dagogique'
    'pedagogique'   = 'p�dagogique'
    'Thematique'    = 'Th�matique'
    'thematique'    = 'th�matique'
    'Concu'         = 'Con�u'
    'concu'         = 'con�u'
    'Maitris'       = 'Ma�tris'
    'maitris'       = 'ma�tris'
    'Reuss'         = 'R�uss'
    'reuss'         = 'r�uss'
    'Debloqu'       = 'D�bloqu'
    'debloqu'       = 'd�bloqu'
    'Echou'         = '�chou'
    'echou'         = '�chou'
    'Liees'         = 'Li�es'
    'liees'         = 'li�es'
    'Apres'         = 'Apr�s'
    'apres'         = 'apr�s'
    'Generation'    = 'G�n�ration'
    'generation'    = 'g�n�ration'
    'Privees'       = 'Priv�es'
    'privees'       = 'priv�es'
    'Publiques'     = 'Publiques'
    'publiques'     = 'publiques'
    'Recherch'      = 'Recherch'
    'recherch'      = 'recherch'
    'Resultat'      = 'R�sultat'
    'resultat'      = 'r�sultat'
    'Necessaire'    = 'N�cessaire'
    'necessaire'    = 'n�cessaire'
    'Amelior'       = 'Am�lior'
    'amelior'       = 'am�lior'
    'Tres'          = 'Tr�s'
    'tres'          = 'tr�s'
    'Pres'          = 'Pr�s'
    'pres'          = 'pr�s'
    'Voila'         = 'Voil�'
    'voila'         = 'voil�'
    'Donnees'       = 'Donn�es'
    'donnees'       = 'donn�es'
    'Acces'         = 'Acc�s'
    'acces'         = 'acc�s'
    'Probleme'      = 'Probl�me'
    'probleme'      = 'probl�me'
    'Methode'       = 'M�thode'
    'methode'       = 'm�thode'
    'Modifie'       = 'Modifi�'
    'modifie'       = 'modifi�'
}

function Fix-Word {
    param([string]$text)
    foreach ($pattern in $replacements.Keys) {
        $text = $text -replace $pattern, $replacements[$pattern]
    }
    return $text
}

$files = Get-ChildItem -Path "app/(app)/dashboard/documentation" -Recurse -Filter "*.tsx" | ForEach-Object { $_.FullName }
$files += "components/FooterSection.tsx"

foreach ($file in $files) {
    $lines = Get-Content -Path $file
    $newLines = @()
    $fixed = $false
    foreach ($line in $lines) {
        if ($line -match 'font-valorax|font-venite') {
            $newLines += $line
        } else {
            $fixedLine = Fix-Word $line
            if ($fixedLine -ne $line) { $fixed = $true }
            $newLines += $fixedLine
        }
    }
    if ($fixed) {
        $newLines | Set-Content -Path $file -Encoding UTF8
        Write-Output "Fixed: $file"
    }
}
